import prisma from '../config/database';
import {
  UpdateProfileInput,
} from '../validators/auth.validator';

// Note: registerUser and loginUser functions removed
// User registration and authentication are now handled by Clerk
// Users are automatically created via Clerk webhook when they sign up

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
