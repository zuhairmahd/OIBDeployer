import React, { useState } from 'react';
import { Shield, Settings, FileText, RefreshCw, ArrowRight, ArrowLeft, CheckCircle, Monitor, Laptop, Smartphone, Tablet } from 'lucide-react';

const QuickDeployWizard = ({ onPolicyTypesSelected, onBack, selectedVersion }) => {
  const [selectedPolicyTypes, setSelectedPolicyTypes] = useState([]);
  const [selectedOS, setSelectedOS] = useState([]);
  const [currentStep, setCurrentStep] = useState('os-selection');

  const osOptions = [
    {
      id: 'WINDOWS',
      name: 'Windows',
      description: 'Windows 11 Devices deployed by Autopilot',
      icon: Monitor,
      color: 'blue',
      enabled: true
    },
    {
      id: 'MACOS',
      name: 'macOS',
      description: 'Apple MacOS Devices deployed by ABM',
      icon: Laptop,
      color: 'gray',
      enabled: true
    },
    {
      id: 'BYOD',
      name: 'BYOD',
      description: 'App Protection Policies',
      icon: Shield,
      color: 'green',
      enabled: false,
      comingSoon: true
    },
    {
      id: 'iOS',
      name: 'iOS',
      description: 'Fully-Managed iOS Devices',
      icon: Smartphone,
      color: 'orange',
      enabled: false,
      comingSoon: true
    },
    {
      id: 'ANDROID',
      name: 'Android',
      description: 'Not Available',
      icon: Tablet,
      color: 'purple',
      enabled: false,
      comingSoon: false
    }
  ];

  const policyTypes = [
    {
      id: 'compliance',
      name: 'Compliance Policies',
      description: 'Device compliance requirements and health checks',
      icon: Shield,
      color: 'blue'
    },
    {
      id: 'endpoint-security',
      name: 'Endpoint Security',
      description: 'Security configurations and threat protection',
      icon: Shield,
      color: 'red'
    },
    {
      id: 'settings-catalog',
      name: 'Settings Catalog',
      description: 'Device management and user experience settings',
      icon: Settings,
      color: 'green'
    },
    {
      id: 'update-policies',
      name: 'Update Policies',
      description: 'Windows Update for Business configuration. (Do not deploy if using Autopatch)',
      icon: RefreshCw,
      color: 'orange'
    }
  ];

  const toggleOS = (osId, enabled) => {
    if (!enabled) return; // Don't allow selection of disabled options
    
    setSelectedOS(prev => 
      prev.includes(osId) 
        ? prev.filter(id => id !== osId)
        : [...prev, osId]
    );
  };

  const togglePolicyType = (typeId) => {
    setSelectedPolicyTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const selectAllPolicyTypes = () => {
    const allTypes = policyTypes.map(type => type.id);
    setSelectedPolicyTypes(selectedPolicyTypes.length === policyTypes.length ? [] : allTypes);
  };

  const handleOSContinue = () => {
    if (selectedOS.length > 0) {
      setCurrentStep('policy-types');
    }
  };

  const handlePolicyTypesContinue = () => {
    if (selectedPolicyTypes.length > 0) {
      onPolicyTypesSelected({ policyTypes: selectedPolicyTypes, osTypes: selectedOS });
    }
  };

  const handleStepBack = () => {
    if (currentStep === 'policy-types') {
      setCurrentStep('os-selection');
    } else {
      onBack();
    }
  };

  return (
    <div className="wizard-container">
      <div className="wizard-header">
        <h2>New Deployment Setup</h2>
        {currentStep === 'os-selection' && (
          <p>Select the operating systems you want to deploy policies for</p>
        )}
        {currentStep === 'policy-types' && (
          <p>Select the policy types you want to deploy from the latest OpenIntuneBaseline</p>
        )}
        {selectedVersion && (
          <div className="version-info">
            <span className="version-badge">Latest Version: {selectedVersion}</span>
          </div>
        )}
      </div>

      {/* OS Selection Step */}
      {currentStep === 'os-selection' && (
        <div className="os-selection">
          <div className="selection-header">
            <h3>Choose Operating Systems</h3>
          </div>

          <div className="policy-types-grid">
            {osOptions.map(os => {
              const IconComponent = os.icon;
              const isSelected = selectedOS.includes(os.id);
              const isDisabled = !os.enabled;
              
              return (
                <div 
                  key={os.id}
                  className={`policy-type-card ${isSelected ? 'selected' : ''} ${os.color} ${isDisabled ? 'disabled' : ''}`}
                  onClick={() => toggleOS(os.id, os.enabled)}
                >
                  <div className="card-header">
                    <div className="card-icon">
                      <IconComponent size={32} />
                    </div>
                    <div className="card-check">
                      {isSelected && <CheckCircle size={20} />}
                    </div>
                    {os.comingSoon && (
                      <div className="coming-soon-badge">
                        Coming Soon
                      </div>
                    )}
                  </div>
                  <div className="card-content">
                    <h4>{os.name}</h4>
                    <p>{os.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Policy Types Selection Step */}
      {currentStep === 'policy-types' && (
        <div className="policy-types-selection">
          <div className="selection-header">
            <h3>Choose Policy Types </h3>
            <button 
              className="btn-link select-all"
              onClick={selectAllPolicyTypes}
            >
              {selectedPolicyTypes.length === policyTypes.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="policy-types-grid">
            {policyTypes.map(type => {
              const IconComponent = type.icon;
              const isSelected = selectedPolicyTypes.includes(type.id);
              
              return (
                <div 
                  key={type.id}
                  className={`policy-type-card ${isSelected ? 'selected' : ''} ${type.color}`}
                  onClick={() => togglePolicyType(type.id)}
                >
                  <div className="card-header">
                    <div className="card-icon">
                      <IconComponent size={32} />
                    </div>
                    <div className="card-check">
                      {isSelected && <CheckCircle size={20} />}
                    </div>
                  </div>
                  <div className="card-content">
                    <h4>{type.name}</h4>
                    <p>{type.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="wizard-navigation">
        <button className="btn-secondary" onClick={handleStepBack}>
          <ArrowLeft size={16} />
          Back
        </button>
        
        {currentStep === 'os-selection' && (
          <button 
            className="btn-primary"
            onClick={handleOSContinue}
            disabled={selectedOS.length === 0}
          >
            Continue
            <ArrowRight size={16} />
          </button>
        )}

        {currentStep === 'policy-types' && (
          <button 
            className="btn-primary"
            onClick={handlePolicyTypesContinue}
            disabled={selectedPolicyTypes.length === 0}
          >
            Continue
            <ArrowRight size={16} />
          </button>
        )}
      </div>

      <div className="wizard-footer">
        {currentStep === 'os-selection' && (
          <p className="selection-summary">
            {selectedOS.length > 0 
              ? `${selectedOS.length} operating system${selectedOS.length === 1 ? '' : 's'} selected`
              : 'Select at least one operating system to continue'
            }
          </p>
        )}
        {currentStep === 'policy-types' && (
          <p className="selection-summary">
            {selectedPolicyTypes.length > 0 
              ? `${selectedPolicyTypes.length} policy type${selectedPolicyTypes.length === 1 ? '' : 's'} selected`
              : 'Select at least one policy type to continue'
            }
          </p>
        )}
      </div>
    </div>
  );
};

export default QuickDeployWizard;
