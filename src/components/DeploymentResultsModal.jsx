import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X, RotateCcw, Download, Archive } from 'lucide-react';

const DeploymentResultsModal = ({ 
  isOpen, 
  onClose, 
  results, 
  selectedPolicies, 
  onNewDeployment 
}) => {
  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const successCount = results.filter(r => r.success).length;
  const failureCount = results.filter(r => !r.success).length;
  const totalCount = results.length;

  const handleNewDeployment = () => {
    onNewDeployment();
    onClose();
  };

  const exportResults = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      summary: {
        total: totalCount,
        successful: successCount,
        failed: failureCount
      },
      results: results.map(result => ({
        policy: result.policyName || result.fileName || 'Unknown',
        success: result.success,
        message: result.message,
        error: result.error?.message || null
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oib-deployment-results-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content deployment-results-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Deployment Results</h2>
          <button onClick={onClose} className="modal-close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Summary Section */}
          <div className="deployment-summary">
            <div className="summary-stats">
              <div className="stat-item success">
                <CheckCircle size={20} />
                <span className="stat-number">{successCount}</span>
                <span className="stat-label">Successful</span>
              </div>
              <div className="stat-item failure">
                <AlertCircle size={20} />
                <span className="stat-number">{failureCount}</span>
                <span className="stat-label">Failed</span>
              </div>
              <div className="stat-item total">
                <Archive size={20} />
                <span className="stat-number">{totalCount}</span>
                <span className="stat-label">Total</span>
              </div>
            </div>
            
            {failureCount > 0 && (
              <div className="deployment-warning">
                <AlertCircle size={16} />
                <span>Some policies failed to deploy. Review the details below.</span>
              </div>
            )}
            
            {successCount === totalCount && (
              <div className="deployment-success">
                <CheckCircle size={16} />
                <span>All policies deployed successfully!</span>
              </div>
            )}
          </div>

          {/* Results List */}
          <div className="deployment-results-list">
            <h3>Deployment Details</h3>
            <div className="results-container">
              {results.map((result, index) => (
                <div 
                  key={index} 
                  className={`result-item ${result.success ? 'success' : 'failure'}`}
                >
                  <div className="result-icon">
                    {result.success ? (
                      <CheckCircle size={16} />
                    ) : (
                      <AlertCircle size={16} />
                    )}
                  </div>
                  <div className="result-content">
                    <div className="result-policy">
                      {result.policyName || 
                       result.fileName ||
                       selectedPolicies[index]?.displayName || 
                       selectedPolicies[index]?.name || 
                       selectedPolicies[index]?.fileName ||
                       'Unknown Policy'}
                    </div>
                    <div className="result-message">
                      {result.message}
                    </div>
                    {!result.success && result.error && (
                      <div className="result-error">
                        <strong>Error:</strong> {typeof result.error === 'string' ? result.error : result.error.message || JSON.stringify(result.error)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={exportResults} className="btn btn-secondary">
            <Download size={16} />
            Export Results
          </button>
          <button onClick={handleNewDeployment} className="btn btn-primary">
            <RotateCcw size={16} />
            Deploy More Policies
          </button>
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeploymentResultsModal;
