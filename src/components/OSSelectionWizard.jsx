import React, { useState } from 'react';
import { Monitor, Laptop, ArrowRight, ArrowLeft, CheckCircle, Shield, Smartphone, Tablet } from 'lucide-react';

const OSSelectionWizard = ({ onOSSelected, onBack, selectedVersion }) => {
  const [selectedOS, setSelectedOS] = useState([]);

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
      description: 'Fully-Managed Android Enterprise Devices',
      icon: Tablet,
      color: 'purple',
      enabled: false,
      comingSoon: false
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

  const handleContinue = () => {
    if (selectedOS.length > 0) {
      onOSSelected(selectedOS);
    }
  };

  return (
    <div className="wizard-container">
      <div className="wizard-header">
        <h2>Select Operating Systems</h2>
        <p>Choose which operating systems you want to scan for existing policies</p>
        {selectedVersion && (
          <div className="version-info">
            <span className="version-badge">Comparing against: {selectedVersion}</span>
          </div>
        )}
      </div>

      <div className="os-selection">
        <div className="selection-header">
          <h3>Choose Operating Systems to Scan</h3>
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

      <div className="wizard-navigation">
        <button className="btn-secondary" onClick={onBack}>
          <ArrowLeft size={16} />
          Back
        </button>
        
        <button 
          className="btn-primary"
          onClick={handleContinue}
          disabled={selectedOS.length === 0}
        >
          Continue
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="wizard-footer">
        <p className="selection-summary">
          {selectedOS.length > 0 
            ? `${selectedOS.length} operating system${selectedOS.length === 1 ? '' : 's'} selected for scanning`
            : 'Select at least one operating system to continue'
          }
        </p>
      </div>
    </div>
  );
};

export default OSSelectionWizard;
