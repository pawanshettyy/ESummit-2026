import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response.util';
import { verifyRefreshToken, generateTokenPair } from '../utils/jwt.util';
import logger from '../utils/logger.util';

// Register and login controllers removed - authentication is now handled by Clerk

/**
 * Get current user profile
 */
export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user.userId; // From auth middleware
    const user = await authService.getUserProfile(userId);

    sendSuccess(res, 'Profile fetched successfully', user);
  } catch (error: any) {
    logger.error('Get profile error:', error);
    sendError(res, error.message || 'Failed to fetch profile', 400);
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user.userId; // From auth middleware
    const user = await authService.updateUserProfile(userId, req.body);

    logger.info(`Profile updated: ${user.email}`);

    sendSuccess(res, 'Profile updated successfully', user);
  } catch (error: any) {
    logger.error('Update profile error:', error);
    sendError(res, error.message || 'Failed to update profile', 400);
  }
};

/**
 * Refresh access token using refresh token
 */
export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Generate new token pair
    const tokens = generateTokenPair(decoded.userId, decoded.email);

    logger.info(`Token refreshed for user: ${decoded.email}`);

    sendSuccess(res, 'Token refreshed successfully', tokens);
  } catch (error: any) {
    logger.error('Refresh token error:', error);
    sendError(res, 'Invalid or expired refresh token', 401);
  }
};

/**
 * Logout user (client-side token removal)
 */
export const logout = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;

    logger.info(`User logged out: ${userId}`);

    sendSuccess(res, 'Logout successful');
  } catch (error: any) {
    logger.error('Logout error:', error);
    sendError(res, 'Logout failed', 400);
  }
};
