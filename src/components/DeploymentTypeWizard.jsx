import React from 'react';
import { Package, Search, ArrowRight, HelpCircle } from 'lucide-react';

const DeploymentTypeWizard = ({ onSelectType, onBack }) => {
  return (
    <div className="wizard-container">
      <div className="wizard-header">
        <h2>Choose Your Deployment Type</h2>
        <p>Select the type of deployment you want to perform</p>
      </div>

      <div className="deployment-type-options">
        <div 
          className="deployment-type-card new-deployment"
          onClick={() => onSelectType('new')}
        >
          <div className="card-icon">
            <Package size={48} />
          </div>
          <div className="card-content">
            <h3>New Deployment</h3>
            <p>Deploy OpenIntuneBaseline policies for the first time to your tenant</p>
            <div className="card-features">
              <span>• Latest OIB version</span>
              <span>• Select policy types</span>
              <span>• Guided deployment</span>
            </div>
          </div>
          <div className="card-action">
            <ArrowRight size={24} />
          </div>
        </div>

        <div 
          className="deployment-type-card existing-deployment"
          onClick={() => onSelectType('existing')}
        >
          <div className="card-icon">
            <Search size={48} />
          </div>
          <div className="card-content">
            <h3>Existing Deployment</h3>
            <p>Compare your current OIB deployment with the latest version</p>
            <div className="card-features">
              <span>• Policy comparison</span>
              <span>• Version analysis</span>
              <span>• Upgrade guidance</span>
            </div>
          </div>
          <div className="card-action">
            <ArrowRight size={24} />
          </div>
        </div>
      </div>

      <div className="wizard-help">
        <div className="help-item">
          <HelpCircle size={16} />
          <span>Not sure which option to choose? Select "New Deployment" if this is your first time using OIBDeployer, or "Existing Deployment" if you've previously deployed OIB policies.</span>
        </div>
      </div>

      {onBack && (
        <div className="wizard-navigation">
          <button className="btn-secondary" onClick={onBack}>
            Back
          </button>
        </div>
      )}
    </div>
  );
};

export default DeploymentTypeWizard;
