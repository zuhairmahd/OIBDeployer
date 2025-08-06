import React from 'react';
import { Shield, Package, RefreshCw, CheckCircle, Plus } from 'lucide-react';

const StatusPanel = ({ 
  existingPoliciesCount, 
  selectedPoliciesCount, 
  onRefresh, 
  isLoading 
}) => {
  return (
    <div className="status-panel">
      <div className="panel-header">
        <h2>Deployment Status</h2>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="btn btn-secondary btn-small"
          title="Refresh existing policies"
        >
          <RefreshCw className={`btn-icon ${isLoading ? 'spinning' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="status-cards">
        <div className="status-card tenant-status">
          <div className="card-icon">
            <Shield className="icon" />
          </div>
          <div className="card-content">
            <div className="card-value">{existingPoliciesCount}</div>
            <div className="card-label">Existing Policies in Tenant</div>
            <div className="card-subtitle">
              Policies currently deployed in your Intune tenant
            </div>
          </div>
        </div>

        <div className="status-card selection-status">
          <div className="card-icon">
            <Package className="icon" />
          </div>
          <div className="card-content">
            <div className="card-value">{selectedPoliciesCount}</div>
            <div className="card-label">Selected for Deployment</div>
            <div className="card-subtitle">
              OpenIntuneBaseline policies ready to deploy
            </div>
          </div>
        </div>

        <div className="status-card deployment-ready">
          <div className="card-icon">
            {selectedPoliciesCount > 0 ? (
              <CheckCircle className="icon ready" />
            ) : (
              <Plus className="icon waiting" />
            )}
          </div>
          <div className="card-content">
            <div className="card-value">
              {selectedPoliciesCount > 0 ? 'Ready' : 'Waiting'}
            </div>
            <div className="card-label">Deployment Status</div>
            <div className="card-subtitle">
              {selectedPoliciesCount > 0 
                ? 'Ready to deploy selected policies' 
                : 'Select policies to begin deployment'
              }
            </div>
          </div>
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-item">
          <span className="stat-label">Total in Tenant:</span>
          <span className="stat-value">{existingPoliciesCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Ready to Deploy:</span>
          <span className="stat-value">{selectedPoliciesCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Status:</span>
          <span className={`stat-value ${selectedPoliciesCount > 0 ? 'ready' : 'waiting'}`}>
            {selectedPoliciesCount > 0 ? 'Ready' : 'Waiting for Selection'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatusPanel;
