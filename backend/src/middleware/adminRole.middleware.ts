import { Request, Response, NextFunction } from 'express';
import { createClerkClient } from '@clerk/backend';
import logger from '../utils/logger.util';

// Extend Express Request to include Clerk auth
interface ClerkRequest extends Request {
  auth?: (() => { userId?: string | null }) | { userId?: string | null };
}

// Initialize Clerk client with environment variables
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
});

// Valid admin roles
const VALID_ADMIN_ROLES = ['Core', 'JC', 'OC'];

/**
 * Middleware to check if user has any admin role
 * Note: Requires Clerk middleware to be applied first
 */
export async function requireAdmin(
  req: ClerkRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // NOTE: In Clerk Express v1.7+, req.auth is a function, not an object
    const auth = typeof req.auth === 'function' ? req.auth() : req.auth;
    let userId = auth?.userId;

    // WORKAROUND: If Clerk middleware didn't populate userId, extract from JWT manually
    // This is needed because getToken() from @clerk/clerk-react returns a custom JWT format
    // that @clerk/express middleware doesn't automatically validate
    if (!userId && req.headers.authorization) {
      try {
        const token = req.headers.authorization.replace('Bearer ', '');
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
          // Extract userId from 'sub' claim
          if (payload.sub) {
            userId = payload.sub;
          }
        }
      } catch (e) {
        logger.warn('Failed to extract userId from JWT:', e);
      }
    }

    logger.debug('Admin middleware - checking auth', {
      hasAuth: !!auth,
      userId: userId,
    });

    if (!userId) {
      logger.warn('Admin access denied - no user ID in request', {
        headers: req.headers.authorization ? 'present' : 'missing',
        path: req.path,
        authObject: auth ? JSON.stringify(auth) : 'null',
      });
      res.status(401).json({
        success: false,
        error: 'Unauthorized - Please sign in to access admin panel',
        details: 'No authentication token found',
      });
      return;
    }

    // Get user from Clerk to check role
    const user = await clerkClient.users.getUser(userId);
    const role = user.publicMetadata?.role as string;
    logger.debug('Admin role check', {
      userId,
      role,
      publicMetadata: user.publicMetadata,
    });

    if (!role || !VALID_ADMIN_ROLES.includes(role)) {
      logger.warn(`Unauthorized admin access attempt by user ${userId}`, {
        currentRole: role,
        validRoles: VALID_ADMIN_ROLES,
      });
      res.status(403).json({
        success: false,
        error: 'Access denied. Admin role required.',
        details: `Your current role: ${role || 'none'}. Required: ${VALID_ADMIN_ROLES.join(', ')}`,
      });
      return;
    }

    // Attach role to request for downstream use
    req.adminRole = role;
    req.clerkUserId = userId;

    logger.info(`Admin access granted: ${userId} (${role})`);
    next();
  } catch (error: any) {
    console.error('🔴 ADMIN MIDDLEWARE ERROR:', error);
    logger.error('Admin role check failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify admin role',
      details: error.message,
    });
  }
}

/**
 * Middleware to check if user has one of the specified roles
 * @param allowedRoles - Array of roles that can access the route
 */
export function requireRole(allowedRoles: string[]) {
  return async (
    req: ClerkRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // NOTE: In Clerk Express v1.7+, req.auth is a function, not an object
      const auth = req.auth && typeof req.auth === 'function' ? req.auth() : req.auth;
      const userId = auth?.userId;

      if (!userId) {
        logger.warn('Role check failed - no user ID in request', {
          path: req.path,
          allowedRoles,
        });
        res.status(401).json({
          success: false,
          error: 'Unauthorized - Please sign in to access this resource',
          details: 'No authentication token found',
        });
        return;
      }

      // Get user from Clerk to check role
      const user = await clerkClient.users.getUser(userId);
      const role = user.publicMetadata?.role as string;

      if (!role || !allowedRoles.includes(role)) {
        logger.warn(
          `Insufficient permissions: User ${userId} (${role}) attempted to access ${allowedRoles.join(', ')} only route`
        );
        res.status(403).json({
          success: false,
          error: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
          userRole: role || 'none',
        });
        return;
      }

      // Attach role to request
      req.adminRole = role;
      req.clerkUserId = userId;

      next();
    } catch (error: any) {
      logger.error('Role check failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to verify role permissions',
        details: error.message,
      });
    }
  };
}

/**
 * Middleware to check specific permissions (for future granular control)
 */
export function requirePermission(permission: string) {
  return async (
    req: ClerkRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // NOTE: In Clerk Express v1.7+, req.auth is a function, not an object
      const auth = req.auth && typeof req.auth === 'function' ? req.auth() : req.auth;
      const userId = auth?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      // Get user from Clerk to check role and permissions
      const user = await clerkClient.users.getUser(userId);
      const role = user.publicMetadata?.role as string;
      
      if (!role || !hasFeatureAccess(role, permission)) {
        res.status(403).json({
          success: false,
          error: `Missing required permission: ${permission}`,
        });
        return;
      }

      req.adminRole = role;
      req.clerkUserId = userId;

      next();
    } catch (error) {
      logger.error('Permission check failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to verify permissions',
      });
    }
  };
}

/**
 * Helper function to check if a role has access to a feature
 */
export function hasFeatureAccess(role: string, feature: string): boolean {
  const rolePermissions: Record<string, Record<string, boolean>> = {
    Core: {
      participants: true,
      scanner: true,
      analytics: true,
      eventIds: true,
      export: true,
      edit: true,
    },
    JC: {
      participants: true,
      scanner: true,
      analytics: true,
      eventIds: false,
      export: true,
      edit: false,
    },
    OC: {
      participants: true,
      scanner: true,
      analytics: false,
      eventIds: false,
      export: false,
      edit: false,
    },
  };

  return rolePermissions[role]?.[feature] || false;
}

// TypeScript type augmentation for Express Request
declare global {
  namespace Express {
    interface Request {
      adminRole?: string;
      clerkUserId?: string;
    }
  }
}
