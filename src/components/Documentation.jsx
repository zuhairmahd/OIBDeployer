import React from 'react';
import { CheckCircle, AlertTriangle, Info, ExternalLink, ArrowLeft } from 'lucide-react';

const Documentation = ({ onBack }) => {
  return (
    <div className="documentation">
      <div className="documentation-header">
        <button onClick={onBack} className="btn btn-secondary back-btn">
          <ArrowLeft size={16} />
          Back to Main
        </button>
        <h1>OIB Deployer - Documentation & FAQ</h1>
      </div>

      <div className="documentation-content">
        {/* Quick Start Guide */}
        <section className="doc-section">
          <h2>🚀 Quick Start Guide</h2>
          <div className="steps">
            <div className="step">
              <span className="step-number">1</span>
              <div className="step-content">
                <h3>Authentication</h3>
                <p>Click "Connect to Microsoft" to authenticate with your Azure AD tenant using your Microsoft account.</p>
              </div>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              <div className="step-content">
                <h3>Select Policies</h3>
                <p>Choose your operating system (Windows/macOS) and version, then select the policies you want to deploy.</p>
              </div>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <div className="step-content">
                <h3>Review & Deploy</h3>
                <p>Review your selected policies and click "Deploy Selected Policies" to deploy them to your Intune tenant.</p>
              </div>
            </div>
            <div className="step">
              <span className="step-number">4</span>
              <div className="step-content">
                <h3>Monitor Results</h3>
                <p>View deployment results and any errors that may have occurred during the process.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="doc-section">
          <h2>❓ Frequently Asked Questions</h2>
          
          <div className="faq-item">
            <h3>What is OIB Deployer?</h3>
            <p>
              OIB Deployer is a web-based tool that simplifies the deployment of OpenIntuneBaseline policies to Microsoft Intune tenants. 
              It provides a user-friendly interface to select and deploy standardized security policies without manual configuration.
            </p>
          </div>

          <div className="faq-item">
            <h3>What policies can I deploy?</h3>
            <p>You can deploy various types of policies including:</p>
            <ul>
              <li><strong>Compliance Policies:</strong> Device health, security, and password requirements</li>
              <li><strong>Settings Catalog:</strong> Advanced device configurations and security settings</li>
              <li><strong>Endpoint Security:</strong> Antivirus, firewall, encryption, and attack surface reduction</li>
              <li><strong>Windows Update:</strong> Feature and driver update policies</li>
              <li><strong>Device Configuration:</strong> Basic device settings and restrictions</li>
            </ul>
          </div>

          <div className="faq-item">
            <h3>What permissions do I need?</h3>
            <p>You need the following Microsoft Graph API permissions in your Azure AD tenant:</p>
            <ul>
              <li><code>DeviceManagementConfiguration.ReadWrite.All</code></li>
            </ul>
            <p>Your account must also have appropriate Intune administrator roles.</p>
          </div>

          <div className="faq-item">
            <h3>Will this duplicate existing policies?</h3>
            <p>
              The tool checks for existing policies by name before deployment. If a policy with the same name already exists, 
              deployment will be skipped for that policy. You can see existing policies in the status panel.
            </p>
          </div>

          <div className="faq-item">
            <h3>Can I deploy to production tenants?</h3>
            <div className="warning-box">
              <AlertTriangle size={16} />
              <p>
                <strong>Use with caution:</strong> Always test policies in a development or test tenant first. 
                These are baseline security policies that may impact user experience and device functionality.
              </p>
            </div>
          </div>

          <div className="faq-item">
            <h3>What happens if deployment fails?</h3>
            <p>
              If a policy fails to deploy, you'll see detailed error information in the results section. 
              Common causes include:
            </p>
            <ul>
              <li>Insufficient permissions</li>
              <li>Policy conflicts with existing configurations</li>
              <li>Network connectivity issues</li>
              <li>Invalid policy content or format</li>
            </ul>
          </div>

          <div className="faq-item">
            <h3>How do I customize policies before deployment?</h3>
            <p>
              Currently, the tool deploys policies as-is from the OpenIntuneBaseline repository. 
              For customization, you can:
            </p>
            <ul>
              <li>Deploy the baseline policies first</li>
              <li>Modify them manually in the Microsoft Intune admin center</li>
              <li>Create custom policies based on the baseline templates</li>
            </ul>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="doc-section">
          <h2>🛠️ Troubleshooting</h2>
          
          <div className="troubleshoot-item">
            <h3>Authentication Issues</h3>
            <ul>
              <li>Ensure your account has Intune administrator permissions</li>
              <li>Try logging out and logging back in</li>
              <li>Check if your tenant allows the required Graph API permissions</li>
              <li>Verify that pop-ups are not blocked in your browser</li>
            </ul>
          </div>

          <div className="troubleshoot-item">
            <h3>Policy Deployment Errors</h3>
            <ul>
              <li>Check the browser console for detailed error messages</li>
              <li>Verify your account has write permissions to Intune</li>
              <li>Ensure the policy doesn't conflict with existing configurations</li>
              <li>Try deploying policies one at a time to isolate issues</li>
            </ul>
          </div>

          <div className="troubleshoot-item">
            <h3>Network/Loading Issues</h3>
            <ul>
              <li>Check your internet connection</li>
              <li>Disable VPN if experiencing connection issues</li>
              <li>Clear browser cache and cookies</li>
              <li>Try using a different browser or incognito mode</li>
            </ul>
          </div>
        </section>

        {/* Technical Information */}
        <section className="doc-section">
          <h2>🔧 Technical Information</h2>
          
          <div className="tech-info">
            <h3>Policy Sources</h3>
            <p>
              All policies are sourced from the 
              <a href="https://github.com/SkipToTheEndpoint/OpenIntuneBaseline" target="_blank" rel="noopener noreferrer">
                OpenIntuneBaseline repository <ExternalLink size={14} />
              </a>. 
              This community-driven project provides standardized, security-focused baseline configurations for Microsoft Intune.
            </p>
          </div>

          <div className="tech-info">
            <h3>Compatibility</h3>
            <p>
              The import functionality is designed to match the behavior of the 
              <a href="https://github.com/Micke-K/IntuneManagement" target="_blank" rel="noopener noreferrer">
                IntuneManagement PowerShell module <ExternalLink size={14} />
              </a>, 
              ensuring compatibility with existing workflows and policy formats.
            </p>
          </div>

          <div className="tech-info">
            <h3>Data Privacy</h3>
            <p>
              This application runs entirely in your browser. No policy data or tenant information is stored on external servers. 
              Authentication is handled directly through Microsoft's MSAL library, and all API calls go directly to Microsoft Graph.
            </p>
          </div>

          <div className="tech-info">
            <h3>Supported Platforms</h3>
            <ul>
              <li><strong>Windows:</strong> Windows 10/11 and Windows 365</li>
              <li><strong>macOS:</strong> macOS devices managed through Intune</li>
              <li><strong>Browser:</strong> Modern browsers supporting ES6+ and MSAL.js</li>
            </ul>
          </div>
        </section>

        {/* Support & Resources */}
        <section className="doc-section">
          <h2>📚 Resources & Support</h2>
          
          <div className="resources">
            <div className="resource-item">
              <h3>Official Documentation</h3>
              <ul>
                <li>
                  <a href="https://github.com/SkipToTheEndpoint/OpenIntuneBaseline" target="_blank" rel="noopener noreferrer">
                    OpenIntuneBaseline Documentation <ExternalLink size={14} />
                  </a>
                </li>
                <li>
                  <a href="https://docs.microsoft.com/en-us/mem/intune/" target="_blank" rel="noopener noreferrer">
                    Microsoft Intune Documentation <ExternalLink size={14} />
                  </a>
                </li>
                <li>
                  <a href="https://docs.microsoft.com/en-us/graph/api/resources/intune-graph-overview" target="_blank" rel="noopener noreferrer">
                    Microsoft Graph Intune API <ExternalLink size={14} />
                  </a>
                </li>
              </ul>
            </div>

            <div className="resource-item">
              <h3>Community</h3>
              <ul>
                <li>
                  <a href="https://techcommunity.microsoft.com/t5/microsoft-intune/ct-p/MicrosoftIntune" target="_blank" rel="noopener noreferrer">
                    Microsoft Intune Tech Community <ExternalLink size={14} />
                  </a>
                </li>
                <li>
                  <a href="https://www.reddit.com/r/Intune/" target="_blank" rel="noopener noreferrer">
                    r/Intune on Reddit <ExternalLink size={14} />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Version Info */}
        <section className="doc-section version-info">
          <h2>ℹ️ Version Information</h2>
          <div className="info-box">
            <Info size={16} />
            <div>
              <p><strong>OIB Deployer Version:</strong> 1.0.0</p>
              <p><strong>Last Updated:</strong> August 2025</p>
              <p><strong>Compatible with:</strong> OpenIntuneBaseline v3.0+</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Documentation;
