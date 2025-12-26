import { clerkMiddleware, requireAuth, getAuth } from '@clerk/express';

/**
 * Clerk middleware - adds auth to req object
 * Use this to make Clerk available on all routes
 * 
 * This middleware automatically:
 * - Validates JWT tokens from Authorization header (Bearer token)
 * - Validates session tokens from __session cookie
 * - Populates req.auth() with user information (v1.7+: call as function!)
 * - Sets auth().userId if authenticated
 * 
 * IMPORTANT: In @clerk/express v1.7+, req.auth is a FUNCTION, not an object!
 * You must call req.auth() to get the auth object.
 * 
 * Environment variables required:
 * - CLERK_PUBLISHABLE_KEY
 * - CLERK_SECRET_KEY
 */
export const clerkAuth = clerkMiddleware();

/**
 * Protected route middleware
 * Requires user to be authenticated
 * 
 * Use this on routes that MUST have an authenticated user
 */
export const requireClerkAuth = requireAuth();

/**
 * Extract user ID from Clerk auth
 * Works with both req.auth() function (v5+) and getAuth() helper
 */
export function getClerkUserId(req: any): string | null {
  // Try req.auth() first (v5+ - function call)
  try {
    if (typeof req.auth === 'function') {
      const auth = req.auth();
      if (auth?.userId) {
        return auth.userId;
      }
    }
  } catch (error) {
    logger.error('Error calling req.auth():', error);
  }
  
  // Fallback to getAuth() helper
  try {
    const auth = getAuth(req);
    return auth?.userId || null;
  } catch (error) {
    logger.error('Error getting auth from request:', error);
    return null;
  }
}

/**
 * Get full auth object from Clerk
 */
export async function getClerkUser(req: any) {
  const userId = getClerkUserId(req);
  if (!userId) return null;
  
  // Return the full auth object (call as function in v5+)
  if (typeof req.auth === 'function') {
    return req.auth();
  }
  return getAuth(req);
}

