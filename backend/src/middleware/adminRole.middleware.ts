import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.util';

// Valid admin roles
const VALID_ADMIN_ROLES = ['Core', 'JC', 'OC'];

/**
 * Middleware to check if user has any admin role
 * Note: Requires Clerk middleware to be applied first
 */
export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // @ts-ignore - auth is added by Clerk middleware
    const userId = req.auth?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized - No user ID found',
      });
      return;
    }

    // Get user from Clerk to check role
    const { clerkClient } = await import('@clerk/clerk-sdk-node');
    const user = await clerkClient.users.getUser(userId);
    const role = user.publicMetadata?.role as string;

    if (!role || !VALID_ADMIN_ROLES.includes(role)) {
      logger.warn(`Unauthorized admin access attempt by user ${userId}`);
      res.status(403).json({
        success: false,
        error: 'Access denied. Admin role required.',
      });
      return;
    }

    // Attach role to request for downstream use
    req.adminRole = role;
    req.clerkUserId = userId;

    logger.info(`Admin access granted: ${userId} (${role})`);
    next();
  } catch (error) {
    logger.error('Admin role check failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify admin role',
    });
  }
}

/**
 * Middleware to check if user has one of the specified roles
 * @param allowedRoles - Array of roles that can access the route
 */
export function requireRole(allowedRoles: string[]) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // @ts-ignore - auth is added by Clerk middleware
      const userId = req.auth?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized - No user ID found',
        });
        return;
      }

      // Get user from Clerk to check role
      const { clerkClient } = await import('@clerk/clerk-sdk-node');
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
    } catch (error) {
      logger.error('Role check failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to verify role permissions',
      });
    }
  };
}

/**
 * Middleware to check specific permissions (for future granular control)
 */
export function requirePermission(permission: string) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // @ts-ignore - auth is added by Clerk middleware
      const userId = req.auth?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      // Get user from Clerk to check role and permissions
      const { clerkClient } = await import('@clerk/clerk-sdk-node');
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
