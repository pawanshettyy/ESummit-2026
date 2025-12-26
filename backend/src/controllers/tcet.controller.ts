import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Assign a unique TCET code to a user
 */
export const assignTcetCode = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Check if user already has a code assigned
    const existingCode = await prisma.tcetCode.findFirst({
      where: {
        assignedTo: userId,
        isAssigned: true
      }
    });

    if (existingCode) {
      return res.status(200).json({
        success: true,
        data: {
          code: existingCode.code,
          assignedAt: existingCode.assignedAt
        },
        message: 'User already has a code assigned'
      });
    }

    // Find the first available unassigned code
    const availableCode = await prisma.tcetCode.findFirst({
      where: {
        isAssigned: false
      },
      orderBy: {
        code: 'asc'
      }
    });

    if (!availableCode) {
      return res.status(404).json({
        success: false,
        error: 'No available codes remaining. Please contact support.'
      });
    }

    // Assign the code to the user
    const assignedCode = await prisma.tcetCode.update({
      where: {
        id: availableCode.id
      },
      data: {
        isAssigned: true,
        assignedTo: userId,
        assignedAt: new Date()
      }
    });

    return res.status(200).json({
      success: true,
      data: {
        code: assignedCode.code,
        assignedAt: assignedCode.assignedAt
      },
      message: 'Code assigned successfully'
    });

  } catch (error) {
    logger.error('Error assigning TCET code:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to assign code'
    });
  }
};

/**
 * Get the code assigned to a user
 */
export const getUserTcetCode = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const code = await prisma.tcetCode.findFirst({
      where: {
        assignedTo: userId,
        isAssigned: true
      }
    });

    if (!code) {
      return res.status(404).json({
        success: false,
        error: 'No code assigned to this user'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        code: code.code,
        assignedAt: code.assignedAt
      }
    });

  } catch (error) {
    logger.error('Error fetching TCET code:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch code'
    });
  }
};

/**
 * Get statistics about TCET codes
 */
export const getTcetCodeStats = async (_req: Request, res: Response) => {
  try {
    const totalCodes = await prisma.tcetCode.count();
    const assignedCodes = await prisma.tcetCode.count({
      where: { isAssigned: true }
    });
    const availableCodes = totalCodes - assignedCodes;

    return res.status(200).json({
      success: true,
      data: {
        total: totalCodes,
        assigned: assignedCodes,
        available: availableCodes
      }
    });

  } catch (error) {
    logger.error('Error fetching TCET code stats:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
};
