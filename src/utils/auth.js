import { PublicClientApplication } from '@azure/msal-browser';
import { CONFIG } from './config.js';

class AuthService {
    constructor() {
        this.msalInstance = null;
        this.account = null;
        this.isInitialized = false;
    }

    async initialize() {
        if (this.isInitialized) return;

        try {
            this.msalInstance = new PublicClientApplication({
                auth: {
                    clientId: CONFIG.msal.clientId,
                    authority: CONFIG.msal.authority,
                    redirectUri: CONFIG.msal.redirectUri
                },
                cache: {
                    cacheLocation: 'sessionStorage',
                    storeAuthStateInCookie: false
                }
            });

            await this.msalInstance.initialize();
            this.isInitialized = true;
            
            // Handle redirect response
            const response = await this.msalInstance.handleRedirectPromise();
            if (response && response.account) {
                this.account = response.account;
            } else {
                // Try to get account from cache
                const accounts = this.msalInstance.getAllAccounts();
                if (accounts.length > 0) {
                    this.account = accounts[0];
                }
            }
        } catch (error) {
            console.error('Error initializing MSAL:', error);
            throw new Error('Failed to initialize authentication');
        }
    }

    async login() {
        if (!this.isInitialized) {
            throw new Error('Auth service not initialized');
        }

        try {
            const response = await this.msalInstance.loginPopup({
                scopes: CONFIG.msal.scopes
            });
            
            this.account = response.account;
            return this.account;
        } catch (error) {
            console.error('Login failed:', error);
            throw new Error('Login failed: ' + error.message);
        }
    }

    async logout() {
        if (!this.isInitialized) return;

        try {
            await this.msalInstance.logoutPopup({
                account: this.account
            });
            this.account = null;
        } catch (error) {
            console.error('Logout failed:', error);
            throw new Error('Logout failed: ' + error.message);
        }
    }

    async getAccessToken() {
        if (!this.account) {
            throw new Error('No account available');
        }

        try {
            const response = await this.msalInstance.acquireTokenSilent({
                scopes: CONFIG.msal.scopes,
                account: this.account
            });
            
            return response.accessToken;
        } catch (error) {
            // Try interactive token acquisition
            try {
                const response = await this.msalInstance.acquireTokenPopup({
                    scopes: CONFIG.msal.scopes,
                    account: this.account
                });
                return response.accessToken;
            } catch (interactiveError) {
                console.error('Token acquisition failed:', interactiveError);
                throw new Error('Failed to acquire access token');
            }
        }
    }

    isAuthenticated() {
        return this.account !== null;
    }

    getAccount() {
        return this.account;
    }

    getTenantId() {
        if (!this.account) {
            return null;
        }
        return this.account.tenantId;
    }

    getTenantInfo() {
        if (!this.account) {
            return null;
        }
        
        return {
            tenantId: this.account.tenantId,
            homeAccountId: this.account.homeAccountId,
            username: this.account.username,
            name: this.account.name,
            environment: this.account.environment
        };
    }
}

// Create singleton instance
export const authService = new AuthService();
export default authService;
