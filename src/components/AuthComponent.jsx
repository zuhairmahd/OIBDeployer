import React from 'react';
import { LogIn, Shield, Lock } from 'lucide-react';

const AuthComponent = ({ onLogin, isLoading, tenantInfo }) => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Shield className="auth-icon" />
          <h2>Microsoft Intune Authentication</h2>
          <p>Sign in with your Microsoft account to deploy OpenIntuneBaseline policies</p>
          {tenantInfo && (
            <div className="current-tenant">
              <p><strong>Current Tenant:</strong> {tenantInfo.tenantId}</p>
              <p><strong>User:</strong> {tenantInfo.username}</p>
            </div>
          )}
        </div>

        <div className="auth-content">
          <div className="auth-info">
            <div className="info-item">
              <Lock className="info-icon" />
              <div>
                <h4>Secure Authentication</h4>
                <p>Uses Microsoft Authentication Library (MSAL) for secure OAuth 2.0 authentication</p>
              </div>
            </div>
            
            <div className="required-permissions">
              <h4>Required Permissions:</h4>
              <ul>
                <li>DeviceManagementConfiguration.ReadWrite.All</li>
              </ul>
            </div>
          </div>

          <button 
            onClick={onLogin} 
            disabled={isLoading}
            className="btn btn-primary btn-large"
          >
            <LogIn className="btn-icon" />
            {isLoading ? 'Signing in...' : 'Sign in with Microsoft'}
          </button>

          <div className="auth-footer">
            <p className="disclaimer">
              This application will request permissions to read and write Intune configuration policies. 
              Your credentials are handled securely by Microsoft's authentication service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;
