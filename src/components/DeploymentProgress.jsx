import React from 'react';
import { CheckCircle, XCircle, Clock, Loader, RotateCcw, ArrowLeft } from 'lucide-react';

const DeploymentProgress = ({ 
  selectedPolicies, 
  results, 
  isLoading, 
  showActions = false, 
  onNewDeployment 
}) => {
  const getStatusIcon = (result) => {
    if (result.success) {
      return <CheckCircle className="status-icon success" />;
    } else {
      return <XCircle className="status-icon error" />;
    }
  };

  const getOverallStats = () => {
    const totalPolicies = selectedPolicies.length;
    const resultsArray = Array.isArray(results) ? results : [];
    const completedResults = resultsArray.length;
    const successCount = resultsArray.filter(r => r.success).length;
    const failureCount = resultsArray.filter(r => !r.success).length;
    const pendingCount = totalPolicies - completedResults;

    return {
      total: totalPolicies,
      completed: completedResults,
      success: successCount,
      failure: failureCount,
      pending: pendingCount,
      progressPercentage: totalPolicies > 0 ? (completedResults / totalPolicies) * 100 : 0
    };
  };

  const stats = getOverallStats();

  return (
    <div className="deployment-progress">
      <div className="progress-header">
        <h2>
          {isLoading ? 'Deploying Policies...' : 'Deployment Results'}
        </h2>
        <p>
          {isLoading 
            ? `Processing ${stats.total} selected policies`
            : `Deployment completed: ${stats.success} successful, ${stats.failure} failed`
          }
        </p>
      </div>

      <div className="progress-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Policies</div>
        </div>
        
        <div className="stat-card success">
          <div className="stat-value">{stats.success}</div>
          <div className="stat-label">Successful</div>
        </div>
        
        <div className="stat-card error">
          <div className="stat-value">{stats.failure}</div>
          <div className="stat-label">Failed</div>
        </div>
        
        <div className="stat-card pending">
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${stats.progressPercentage}%` }}
          />
        </div>
        <div className="progress-text">
          {Math.round(stats.progressPercentage)}% Complete
        </div>
      </div>

      <div className="deployment-list">
        {selectedPolicies.map((policy, index) => {
          const resultsArray = Array.isArray(results) ? results : [];
          const result = resultsArray.find(r => r.index === index);
          const isPending = !result && isLoading;
          const isCompleted = !!result;

          return (
            <div key={`${policy.fileName}-${index}`} className="deployment-item">
              <div className="deployment-status">
                {isPending && (
                  <div className="status-pending">
                    <Loader className="status-icon spinner" />
                  </div>
                )}
                {isCompleted && getStatusIcon(result)}
                {!isLoading && !result && (
                  <div className="status-waiting">
                    <Clock className="status-icon waiting" />
                  </div>
                )}
              </div>

              <div className="deployment-info">
                <div className="policy-name">
                  {policy.actualDisplayName || policy.name}
                </div>
                <div className="policy-details">
                  <span className="policy-type">{policy.policyType}</span>
                  <span className="policy-filename">{policy.fileName}</span>
                </div>
                
                {result && (
                  <div className={`deployment-message ${result.success ? 'success' : 'error'}`}>
                    {result.message}
                  </div>
                )}
                
                {isPending && (
                  <div className="deployment-message pending">
                    Deploying to tenant...
                  </div>
                )}
              </div>

              <div className="deployment-time">
                {isCompleted && (
                  <span className="completion-time">
                    {new Date().toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showActions && (
        <div className="deployment-actions">
          <button
            onClick={onNewDeployment}
            className="btn btn-primary"
          >
            <ArrowLeft className="btn-icon" />
            Deploy More Policies
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="btn btn-secondary"
          >
            <RotateCcw className="btn-icon" />
            Refresh Application
          </button>
        </div>
      )}
    </div>
  );
};

export default DeploymentProgress;
