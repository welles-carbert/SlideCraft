import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "691d2a203c997d12c748998f", 
  requiresAuth: true // Ensure authentication is required for all operations
});
