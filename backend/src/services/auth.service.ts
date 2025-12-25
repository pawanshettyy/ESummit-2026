import prisma from '../config/database';
import { generateTokenPair } from '../utils/jwt.util';
import {
  UpdateProfileInput,
} from '../validators/auth.validator';

/**
 * DEPRECATED: User registration is now handled by Clerk
 * This function is kept for backward compatibility but should not be used
 * Users are automatically created via Clerk webhook when they sign up
 */
export const registerUser = async (clerkUserId: string, email: string, fullName?: string, firstName?: string, lastName?: string) => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return existingUser;
  }

  // Create user from Clerk data
  const user = await prisma.user.create({
    data: {
      clerkUserId,
      email,
      fullName: fullName || null,
      firstName: firstName || null,
      lastName: lastName || null,
    },
    select: {
      id: true,
      clerkUserId: true,
      email: true,
      fullName: true,
      firstName: true,
      lastName: true,
      phone: true,
      college: true,
      yearOfStudy: true,
      rollNumber: true,
      createdAt: true,
    },
  });

  return user;
};

/**
 * DEPRECATED: User login is now handled by Clerk
 * This function is kept for backward compatibility but should not be used
 * Authentication is managed through Clerk's authentication system
 */
export const loginUser = async (clerkUserId: string) => {
  // Find user by Clerk ID
  const user = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  // Generate tokens (if still needed for legacy API)
  const tokens = generateTokenPair(user.id, user.email);

  return {
    user,
    ...tokens,
  };
};

/**
 * Get user profile by ID
 */
export const getUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      clerkUserId: true,
      email: true,
      fullName: true,
      firstName: true,
      lastName: true,
      imageUrl: true,
      phone: true,
      college: true,
      yearOfStudy: true,
      rollNumber: true,
      createdAt: true,
      updatedAt: true,
      lastLogin: true,
      passes: {
        select: {
          id: true,
          passType: true,
          passId: true,
          status: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  userId: string,
  input: UpdateProfileInput
) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: input,
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
      college: true,
      yearOfStudy: true,
      rollNumber: true,
      updatedAt: true,
    },
  });

  return user;
};

/**
 * Get user by email
 */
export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  return user;
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return user;
};
