/**
 * Utility functions for tenant-specific variable replacement in policy content
 */

/**
 * Replace tenant-specific variables in policy content
 * @param {object|string} policyContent - The policy content object or string
 * @param {string} tenantId - The tenant ID to replace %OrganizationId% with
 * @returns {object|string} Policy content with variables replaced
 */
export const replaceTenantVariables = (policyContent, tenantId) => {
  if (!policyContent || !tenantId) {
    return policyContent;
  }

  try {
    // Convert to string for replacement if it's an object
    let contentStr = typeof policyContent === 'string' ? 
      policyContent : JSON.stringify(policyContent);
    
    // Count occurrences before replacement for logging
    const originalStr = contentStr;
    
    // Replace %OrganizationId% with actual tenant ID (case-insensitive)
    contentStr = contentStr.replace(/%OrganizationId%/gi, tenantId);
    
    // Log if any replacements were made
    if (contentStr !== originalStr) {
      const count = (originalStr.match(/%OrganizationId%/gi) || []).length;
      console.log(`✅ Tenant variable replacement: Replaced ${count} occurrence(s) of %OrganizationId% with ${tenantId}`);
    }
    
    // Parse back to object if original was an object
    return typeof policyContent === 'string' ? 
      contentStr : JSON.parse(contentStr);
      
  } catch (error) {
    console.error('Error during tenant variable replacement:', error);
    return policyContent; // Return original on error
  }
};

/**
 * Apply tenant variable replacement to a policy object for deployment
 * @param {object} policyData - Policy data object with content
 * @param {string} tenantId - The tenant ID
 * @returns {object} Policy data with variables replaced
 */
export const applyTenantVariablesToPolicy = (policyData, tenantId) => {
  if (!policyData || !tenantId) {
    return policyData;
  }

  try {
    const updatedPolicy = { ...policyData };
    
    // Replace variables in the main policy content
    if (updatedPolicy.policy) {
      updatedPolicy.policy = replaceTenantVariables(updatedPolicy.policy, tenantId);
    }
    
    return updatedPolicy;
  } catch (error) {
    console.error('Error applying tenant variables to policy:', error);
    return policyData;
  }
};
