/**
 * Tenant utilities for handling tenant-specific operations
 */

/**
 * Format tenant ID for display
 * @param {string} tenantId - The tenant ID
 * @returns {string} Formatted tenant ID
 */
export const formatTenantId = (tenantId) => {
  if (!tenantId) return 'Unknown';
  
  // Format as XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
  if (tenantId.length === 32) {
    return `${tenantId.slice(0, 8)}-${tenantId.slice(8, 12)}-${tenantId.slice(12, 16)}-${tenantId.slice(16, 20)}-${tenantId.slice(20)}`;
  }
  
  return tenantId;
};

/**
 * Get tenant display name from tenant info
 * @param {object} tenantInfo - Tenant information object
 * @returns {string} Display name for the tenant
 */
export const getTenantDisplayName = (tenantInfo) => {
  if (!tenantInfo) return 'Unknown Tenant';
  
  // Extract domain from username if available
  if (tenantInfo.username && tenantInfo.username.includes('@')) {
    const domain = tenantInfo.username.split('@')[1];
    return domain;
  }
  
  // Fallback to tenant ID
  return formatTenantId(tenantInfo.tenantId);
};

/**
 * Create a tenant-specific identifier for policies
 * @param {string} tenantId - The tenant ID
 * @param {string} policyName - The policy name
 * @returns {string} Tenant-specific policy identifier
 */
export const createTenantPolicyId = (tenantId, policyName) => {
  if (!tenantId || !policyName) return policyName || '';
  
  const shortTenantId = tenantId.replace(/-/g, '').slice(0, 8);
  return `${shortTenantId}_${policyName}`;
};

/**
 * Validate if a tenant ID is properly formatted
 * @param {string} tenantId - The tenant ID to validate
 * @returns {boolean} True if valid tenant ID format
 */
export const isValidTenantId = (tenantId) => {
  if (!tenantId) return false;
  
  // Check for GUID format
  const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return guidRegex.test(tenantId);
};

/**
 * Get tenant environment information
 * @param {object} tenantInfo - Tenant information object
 * @returns {object} Environment details
 */
export const getTenantEnvironment = (tenantInfo) => {
  if (!tenantInfo) return { environment: 'unknown', cloud: 'unknown' };
  
  const environment = tenantInfo.environment || 'login.microsoftonline.com';
  
  let cloud = 'Commercial';
  if (environment.includes('microsoftonline.us')) {
    cloud = 'GCC High';
  } else if (environment.includes('microsoftonline.de')) {
    cloud = 'Germany';
  } else if (environment.includes('chinacloudapi.cn')) {
    cloud = 'China';
  }
  
  return { environment, cloud };
};
