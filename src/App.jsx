import React, { useState, useEffect } from 'react';
import { Upload, Settings, CheckCircle, AlertCircle, Loader, BookOpen } from 'lucide-react';
import AuthComponent from './components/AuthComponent';
import PolicySelector from './components/PolicySelector';
import DeploymentProgress from './components/DeploymentProgress';
import StatusPanel from './components/StatusPanel';
import Documentation from './components/Documentation';
import DeploymentResultsModal from './components/DeploymentResultsModal';
import authService from './utils/auth';
import graphAPI from './utils/graph-api';
import githubAPI from './utils/github-api';
import { getTenantDisplayName, isValidTenantId } from './utils/tenant';
import { applyTenantVariablesToPolicy } from './utils/tenant-variables';
import oibLogo from '../assets/oib-logo.svg';
import './styles/App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [account, setAccount] = useState(null);
  const [tenantId, setTenantId] = useState(null);
  const [tenantInfo, setTenantInfo] = useState(null);
  const [existingPolicies, setExistingPolicies] = useState([]);
  const [selectedPolicies, setSelectedPolicies] = useState([]);
  const [deploymentResults, setDeploymentResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState('auth');
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [deploymentProgress, setDeploymentProgress] = useState({
    isDeploying: false,
    currentPolicy: '',
    completed: 0,
    total: 0,
    currentStep: 'preparing'
  });

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setIsLoading(true);
      await authService.initialize();
      
      if (authService.isAuthenticated()) {
        const account = authService.getAccount();
        const tenantId = authService.getTenantId();
        const tenantInfo = authService.getTenantInfo();
        
        setIsAuthenticated(true);
        setAccount(account);
        setTenantId(tenantId);
        setTenantInfo(tenantInfo);
        setCurrentStep('select');
        
        console.log('Already connected to tenant:', tenantId);
        
        await loadExistingPolicies();
      }
    } catch (error) {
      console.error('Failed to initialize app:', error);
      setError('Failed to initialize application');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const account = await authService.login();
      const tenantId = authService.getTenantId();
      const tenantInfo = authService.getTenantInfo();
      
      setIsAuthenticated(true);
      setAccount(account);
      setTenantId(tenantId);
      setTenantInfo(tenantInfo);
      setCurrentStep('select');
      
      console.log('Connected to tenant:', tenantId);
      console.log('Tenant info:', tenantInfo);
      
      await loadExistingPolicies();
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setAccount(null);
      setTenantId(null);
      setTenantInfo(null);
      setCurrentStep('auth');
      setExistingPolicies([]);
      setSelectedPolicies([]);
      setDeploymentResults([]);
      setError(null);
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Logout failed: ' + error.message);
    }
  };

  const loadExistingPolicies = async () => {
    try {
      setIsLoading(true);
      console.log('Loading existing policies from tenant...');
      
      const policies = await graphAPI.getAllPolicies();
      setExistingPolicies(policies);
      
      console.log(`Loaded ${policies.length} existing policies from tenant`);
    } catch (error) {
      console.error('Failed to load existing policies:', error);
      setError('Failed to load existing policies from tenant');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePolicySelection = (policies) => {
    setSelectedPolicies(policies);
  };

  const handleDeployment = async () => {
    if (selectedPolicies.length === 0) {
      setError('Please select at least one policy to deploy');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      // Don't change step - keep on 'select' to preserve UI state
      setDeploymentResults([]);

      // Initialize deployment progress
      setDeploymentProgress({
        isDeploying: true,
        currentPolicy: '',
        completed: 0,
        total: selectedPolicies.length,
        currentStep: 'preparing'
      });

      console.log(`Starting deployment of ${selectedPolicies.length} policies...`);

      // Update progress for policy preparation
      setDeploymentProgress(prev => ({
        ...prev,
        currentStep: 'loading-content',
        currentPolicy: 'Loading policy content...'
      }));

      // Prepare policies for deployment with content and check existing status
      const policiesWithContent = await Promise.all(
        selectedPolicies.map(async (policy, index) => {
          try {
            // Update progress for current policy being loaded
            setDeploymentProgress(prev => ({
              ...prev,
              currentPolicy: `Loading: ${policy.name}`,
              completed: index,
              currentStep: 'loading-content'
            }));

            // Load policy content from GitHub only when deploying
            const content = await githubAPI.getPolicyContent(policy);
            
            // Check if policy is already deployed using improved matching
            const existingPolicy = await graphAPI.checkPolicyExists(
              policy.name,
              policy.policyType
            );
            const isDeployed = !!existingPolicy;

            return {
              policy: content,
              type: policy.policyType,
              fileName: policy.fileName,
              name: policy.name,
              originalPolicy: policy,
              isAlreadyDeployed: isDeployed
            };
          } catch (error) {
            console.error(`Failed to get content for ${policy.fileName}:`, error);
            throw new Error(`Failed to prepare policy ${policy.fileName}: ${error.message}`);
          }
        })
      );

      // Check if any selected policies are already deployed and warn user
      const alreadyDeployedPolicies = policiesWithContent.filter(p => p.isAlreadyDeployed);
      if (alreadyDeployedPolicies.length > 0) {
        const deployedNames = alreadyDeployedPolicies.map(p => p.name).join(', ');
        console.warn(`The following policies are already deployed: ${deployedNames}`);
        // Still proceed with deployment but note this in results
      }

      // Apply tenant variable replacement to all policies before deployment
      if (tenantId) {
        console.log(`Applying tenant variable replacement for tenant: ${tenantId}`);
        setDeploymentProgress(prev => ({
          ...prev,
          currentStep: 'preparing-variables',
          currentPolicy: 'Applying tenant variables...'
        }));
        
        policiesWithContent.forEach((policyData, index) => {
          policiesWithContent[index] = applyTenantVariablesToPolicy(policyData, tenantId);
        });
      } else {
        console.warn('No tenant ID available for variable replacement');
      }

      // Update progress for deployment phase
      setDeploymentProgress(prev => ({
        ...prev,
        currentStep: 'deploying',
        currentPolicy: 'Starting deployment...',
        completed: 0
      }));

      // Deploy policies with progress tracking
      const results = await graphAPI.deployPoliciesBatchWithProgress(
        policiesWithContent,
        (completed, total, currentPolicyName) => {
          setDeploymentProgress(prev => ({
            ...prev,
            currentStep: 'deploying',
            currentPolicy: currentPolicyName || 'Deploying policies...',
            completed: completed,
            total: total
          }));
        }
      );
      setDeploymentResults(results);

      // Reset deployment progress
      setDeploymentProgress({
        isDeploying: false,
        currentStep: '',
        currentPolicy: '',
        completed: 0,
        total: 0
      });

      // Update existing policies list to reflect new deployments
      await loadExistingPolicies();

      const successCount = results.filter(r => r.success).length;
      const failureCount = results.filter(r => !r.success).length;

      console.log(`Deployment completed: ${successCount} successful, ${failureCount} failed`);
      
      if (failureCount > 0) {
        setError(`Deployment completed with ${failureCount} failures. See results for details.`);
      }

      // Show results modal instead of changing step
      setCurrentStep('select');
      setShowResultsModal(true);
    } catch (error) {
      console.error('Deployment failed:', error);
      setError('Deployment failed: ' + error.message);
      setCurrentStep('select');
      
      // Reset deployment progress on error
      setDeploymentProgress({
        isDeploying: false,
        currentStep: '',
        currentPolicy: '',
        completed: 0,
        total: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewDeployment = () => {
    setSelectedPolicies([]);
    setDeploymentResults([]);
    setError(null);
    setShowResultsModal(false);
    // Stay on select step - no need to reload GitHub data
  };

  const handleRefreshPolicies = async () => {
    await loadExistingPolicies();
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <img src={oibLogo} alt="OIB Logo" className="logo-icon" />
            <h1>OIB Deployer</h1>
          </div>
          
          {!isAuthenticated && (
            <div className="nav-buttons">
              <button 
                onClick={() => setShowDocumentation(!showDocumentation)} 
                className="nav-btn"
                title="Documentation & FAQ"
              >
                <BookOpen size={16} />
                {showDocumentation ? 'Back to Login' : 'Help & FAQ'}
              </button>
            </div>
          )}
          
          {isAuthenticated && (
            <div className="user-info">
              <div className="nav-buttons">
                <button 
                  onClick={() => setShowDocumentation(!showDocumentation)} 
                  className="nav-btn"
                  title="Documentation & FAQ"
                >
                  <BookOpen size={16} />
                  {showDocumentation ? 'Back to App' : 'Help & FAQ'}
                </button>
              </div>
              <div className="user-details">
                <span className="user-name">Welcome, {account?.name || account?.username}</span>
                {tenantId && (
                  <span className="tenant-id">
                    Tenant: {getTenantDisplayName(tenantInfo)} 
                    {isValidTenantId(tenantId) && (
                      <span className="tenant-id-full"> ({tenantId})</span>
                    )}
                  </span>
                )}
              </div>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-banner">
            <AlertCircle className="error-icon" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="error-dismiss">
              ×
            </button>
          </div>
        )}

        {isLoading && currentStep === 'auth' && (
          <div className="loading-screen">
            <Loader className="spinner" />
            <p>Initializing application...</p>
          </div>
        )}

        {!isAuthenticated && !isLoading && !showDocumentation && (
          <AuthComponent 
            onLogin={handleLogin} 
            isLoading={isLoading} 
            tenantInfo={tenantInfo}
          />
        )}

        {showDocumentation && (
          <Documentation onBack={() => setShowDocumentation(false)} />
        )}

        {isAuthenticated && !showDocumentation && currentStep === 'select' && (
          <div className="main-content">
            <StatusPanel 
              existingPoliciesCount={existingPolicies.length}
              selectedPoliciesCount={selectedPolicies.length}
              onRefresh={handleRefreshPolicies}
              isLoading={isLoading}
            />
            
            <PolicySelector
              existingPolicies={existingPolicies}
              onPolicySelection={handlePolicySelection}
              onDeploy={handleDeployment}
              isLoading={isLoading}
              tenantId={tenantId}
              tenantInfo={tenantInfo}
            />
          </div>
        )}

        {isAuthenticated && !showDocumentation && currentStep === 'deploy' && (
          <DeploymentProgress
            selectedPolicies={selectedPolicies}
            results={deploymentResults}
            isLoading={isLoading}
          />
        )}
      </main>

      {/* Deployment Results Modal */}
      <DeploymentResultsModal
        isOpen={showResultsModal}
        onClose={() => setShowResultsModal(false)}
        results={deploymentResults}
        selectedPolicies={selectedPolicies}
        onNewDeployment={handleNewDeployment}
      />

      {/* Deployment Progress Overlay */}
      {deploymentProgress.isDeploying && (
        <div className="deployment-progress-overlay">
          <div className="deployment-progress-modal">
            <div className="progress-header">
              <h3>Deploying Policies</h3>
              <div className="progress-stats">
                {deploymentProgress.completed} of {deploymentProgress.total} policies
              </div>
            </div>
            
            <div className="progress-content">
              <div className="progress-bar-container">
                <div 
                  className="progress-bar" 
                  style={{ 
                    width: `${deploymentProgress.total > 0 ? (deploymentProgress.completed / deploymentProgress.total) * 100 : 0}%` 
                  }}
                ></div>
              </div>
              
              <div className="progress-percentage">
                {deploymentProgress.total > 0 ? Math.round((deploymentProgress.completed / deploymentProgress.total) * 100) : 0}%
              </div>
              
              <div className="current-step">
                <strong>
                  {deploymentProgress.currentStep === 'loading' && 'Loading policies...'}
                  {deploymentProgress.currentStep === 'preparing-variables' && 'Preparing tenant variables...'}
                  {deploymentProgress.currentStep === 'deploying' && 'Deploying policies...'}
                </strong>
              </div>
              
              <div className="current-policy">
                {deploymentProgress.currentPolicy}
              </div>
            </div>
            
            <div className="progress-spinner">
              <Loader className="spinner" />
            </div>
          </div>
        </div>
      )}

      <footer className="app-footer">
        <div className="footer-content">
          <p>
            OpenIntuneBaseline Deployer - Deploy standardized Intune policies with ease
          </p>
          <div className="footer-links">
            <a 
              href="https://github.com/SkipToTheEndpoint/OpenIntuneBaseline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              OpenIntuneBaseline Repository
            </a>
            <a 
              href="https://github.com/Micke-K/IntuneManagement" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              IntuneManagement Module
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
