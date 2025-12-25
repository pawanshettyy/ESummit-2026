import prisma from '../config/database';
import logger from '../utils/logger.util';

// Pass pricing configuration
export const PASS_PRICING = {
  pixel: 299,
  silicon: 499,
  quantum: 999,
  tcet_student: 0, // Free for TCET students
} as const;

// Pass upgrade hierarchy (from lowest to highest)
// Note: TCET Student Pass cannot be upgraded (it's a special free pass)
export const PASS_HIERARCHY = ['tcet_student', 'pixel', 'silicon', 'quantum'] as const;

export type PassType = keyof typeof PASS_PRICING;

/**
 * Normalize pass type to match PASS_HIERARCHY format
 * Converts "Quantum Pass", "quantum pass", "QUANTUM", "TCET Student Pass" etc. to lowercase key
 */
export function normalizePassType(passType: string): string {
  // Remove "Pass" suffix and trim, then convert to lowercase
  const normalized = passType.toLowerCase().replace(/\s*pass\s*$/i, '').trim();
  // Handle "tcet student" -> "tcet_student"
  return normalized.replace(/\s+/g, '_');
}

/**
 * Check if a pass upgrade is valid
 */
export function isValidUpgrade(fromPass: string, toPass: string): boolean {
  const fromIndex = PASS_HIERARCHY.indexOf(normalizePassType(fromPass) as PassType);
  const toIndex = PASS_HIERARCHY.indexOf(normalizePassType(toPass) as PassType);
  
  if (fromIndex === -1 || toIndex === -1) {
    return false;
  }
  
  // Can only upgrade to a higher tier
  return toIndex > fromIndex;
}

/**
 * Calculate the upgrade fee
 */
export function calculateUpgradeFee(fromPass: string, toPass: string): number {
  const fromPrice = PASS_PRICING[normalizePassType(fromPass) as PassType] || 0;
  const toPrice = PASS_PRICING[normalizePassType(toPass) as PassType] || 0;
  
  const upgradeFee = toPrice - fromPrice;
  return upgradeFee > 0 ? upgradeFee : 0;
}

/**
 * Get upgrade options for a pass
 */
export function getUpgradeOptions(currentPass: string): Array<{
  passType: string;
  name: string;
  price: number;
  upgradeFee: number;
}> {
  const currentIndex = PASS_HIERARCHY.indexOf(normalizePassType(currentPass) as PassType);
  
  if (currentIndex === -1) {
    return [];
  }
  
  const options = [];
  
  for (let i = currentIndex + 1; i < PASS_HIERARCHY.length; i++) {
    const passType = PASS_HIERARCHY[i];
    const price = PASS_PRICING[passType];
    const upgradeFee = calculateUpgradeFee(currentPass, passType);
    
    // Capitalize first letter for display name
    const name = passType.charAt(0).toUpperCase() + passType.slice(1) + ' Pass';
    
    options.push({
      passType,
      name,
      price,
      upgradeFee,
    });
  }
  
  return options;
}

/**
 * Check if a user can upgrade their pass
 */
export async function canUpgradePass(passId: string): Promise<{
  canUpgrade: boolean;
  reason?: string;
  currentPass?: any;
}> {
  try {
    const pass = await prisma.pass.findUnique({
      where: { passId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });

    if (!pass) {
      return {
        canUpgrade: false,
        reason: 'Pass not found',
      };
    }

    if (pass.status !== 'Active') {
      return {
        canUpgrade: false,
        reason: 'Pass is not active',
        currentPass: pass,
      };
    }

    const currentPassType = normalizePassType(pass.passType);
    const currentIndex = PASS_HIERARCHY.indexOf(currentPassType as PassType);

    if (currentIndex === -1) {
      return {
        canUpgrade: false,
        reason: `Invalid pass type: ${pass.passType}`,
        currentPass: pass,
      };
    }

    // Check if already at highest tier
    if (currentIndex === PASS_HIERARCHY.length - 1) {
      return {
        canUpgrade: false,
        reason: 'Already at highest tier',
        currentPass: pass,
      };
    }

    return {
      canUpgrade: true,
      currentPass: pass,
    };
  } catch (error) {
    logger.error('Error checking upgrade eligibility:', error);
    return {
      canUpgrade: false,
      reason: 'Error checking eligibility',
    };
  }
}

/**
 * Process pass upgrade
 */
export async function upgradePass(
  passId: string,
  newPassType: string,
  transactionId: string
): Promise<{ success: boolean; pass?: any; error?: string }> {
  try {
    const pass = await prisma.pass.findUnique({
      where: { passId },
    });

    if (!pass) {
      return { success: false, error: 'Pass not found' };
    }

    const fromPassType = normalizePassType(pass.passType);
    const toPassType = normalizePassType(newPassType);

    if (!isValidUpgrade(fromPassType, toPassType)) {
      return { success: false, error: 'Invalid upgrade path' };
    }

    const upgradeFee = calculateUpgradeFee(fromPassType, toPassType);
    const newPrice = PASS_PRICING[toPassType as PassType];

    // Create upgrade record and update pass in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create upgrade history
      const upgrade = await tx.passUpgrade.create({
        data: {
          passId: pass.id,
          userId: pass.userId,
          fromPassType: pass.passType,
          toPassType: newPassType,
          upgradeFee,
          originalPrice: Number(pass.price),
          newPrice,
          status: 'completed',
          upgradeDate: new Date(),
        },
      });

      // Update pass
      const updatedPass = await tx.pass.update({
        where: { id: pass.id },
        data: {
          passType: toPassType.charAt(0).toUpperCase() + toPassType.slice(1) + ' Pass',
          price: newPrice,
          originalPassType: pass.originalPassType || pass.passType,
          upgradedFrom: pass.passType,
          upgradeDate: new Date(),
          updatedAt: new Date(),
        },
      });

      // Update transaction with upgrade info
      await tx.transaction.update({
        where: { id: transactionId },
        data: {
          upgradeId: upgrade.id,
          transactionType: 'upgrade',
        },
      });

      return updatedPass;
    });

    logger.info(`Pass upgraded successfully: ${passId} from ${fromPassType} to ${toPassType}`);
    return { success: true, pass: result };
  } catch (error) {
    logger.error('Error upgrading pass:', error);
    return { success: false, error: 'Failed to upgrade pass' };
  }
}

/**
 * Get upgrade history for a pass
 */
export async function getUpgradeHistory(passId: string) {
  try {
    const pass = await prisma.pass.findUnique({
      where: { passId },
    });

    if (!pass) {
      return [];
    }

    const history = await prisma.passUpgrade.findMany({
      where: { passId: pass.id },
      orderBy: { upgradeDate: 'desc' },
      include: {
        transactions: {
          select: {
            amount: true,
            status: true,
            konfhubPaymentId: true,
            createdAt: true,
          },
        },
      },
    });

    return history;
  } catch (error) {
    logger.error('Error fetching upgrade history:', error);
    return [];
  }
}
