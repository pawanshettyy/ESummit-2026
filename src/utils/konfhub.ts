// KonfHub Integration Utility for Frontend
// Complete end-to-end pass and ticketing solution

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export interface KonfHubOrderData {
  clerkUserId: string;
  passType: string;
  price: number;
}

export interface KonfHubOrderResponse {
  orderId: string;
  ticketId?: string;
  amount: number;
  currency: string;
  invoiceNumber: string;
  transactionNumber: string;
  checkoutUrl?: string;
  paymentUrl?: string;
}

export interface KonfHubPaymentResult {
  success: boolean;
  orderId: string;
  ticketId?: string;
  paymentId?: string;
  pass?: any;
}

/**
 * Create a KonfHub order for pass purchase
 */
export const createKonfHubOrder = async (
  orderData: KonfHubOrderData
): Promise<KonfHubOrderResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create order');
    }

    return data.data;
  } catch (error: any) {
    console.error('KonfHub order creation error:', error);
    throw new Error(error.message || 'Failed to create order with KonfHub');
  }
};

/**
 * Verify payment and create pass
 */
export const verifyKonfHubPayment = async (
  orderId: string,
  ticketId?: string,
  paymentId?: string
): Promise<KonfHubPaymentResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/payment/verify-and-create-pass`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        orderId,
        ticketId,
        paymentId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Payment verification failed');
    }

    return {
      success: true,
      orderId,
      ticketId,
      paymentId,
      pass: data.data.pass,
    };
  } catch (error: any) {
    console.error('KonfHub payment verification error:', error);
    throw new Error(error.message || 'Failed to verify payment');
  }
};

/**
 * Handle payment failure
 */
export const handleKonfHubPaymentFailure = async (
  orderId: string,
  errorMessage?: string
): Promise<void> => {
  try {
    await fetch(`${API_BASE_URL}/payment/payment-failed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        orderId,
        error: errorMessage || 'Payment cancelled',
      }),
    });
  } catch (error: any) {
    console.error('Error recording payment failure:', error);
  }
};

/**
 * Open KonfHub checkout/payment URL
 */
export const openKonfHubCheckout = (checkoutUrl: string): void => {
  if (!checkoutUrl) {
    throw new Error('Checkout URL not provided');
  }

  // Open in new window/tab
  const width = 800;
  const height = 600;
  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;

  const popup = window.open(
    checkoutUrl,
    'KonfHub Payment',
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
  );

  if (!popup) {
    // Fallback to same tab if popup blocked
    window.location.href = checkoutUrl;
  }
};

/**
 * Initialize KonfHub payment flow
 */
export const initiateKonfHubPayment = async (
  orderData: KonfHubOrderData,
  onSuccess: (result: KonfHubPaymentResult) => void,
  onFailure: (error: Error) => void
): Promise<void> => {
  try {
    // Step 1: Create order
    const order = await createKonfHubOrder(orderData);

    // Step 2: Open checkout page
    if (order.checkoutUrl || order.paymentUrl) {
      const checkoutUrl = order.checkoutUrl || order.paymentUrl!;
      
      // Listen for payment completion via window messages or polling
      const pollInterval = setInterval(async () => {
        try {
          // Poll for pass creation by checking if user has a pass
          const passResponse = await fetch(
            `${API_BASE_URL}/passes/user/${orderData.clerkUserId}`,
            {
              credentials: 'include',
            }
          );

          const passData = await passResponse.json();

          if (passData.success && passData.data?.passes && passData.data.passes.length > 0) {
            clearInterval(pollInterval);
            onSuccess({
              success: true,
              orderId: order.orderId,
              ticketId: order.ticketId,
              pass: passData.data.passes[0], // Get the first/latest pass
            } as KonfHubPaymentResult);
          }
        } catch (error) {
          console.error('Error polling for pass creation:', error);
        }
      }, 3000); // Poll every 3 seconds

      // Stop polling after 5 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
      }, 300000);

      // Open checkout
      openKonfHubCheckout(checkoutUrl);
    } else {
      throw new Error('No checkout URL provided by KonfHub');
    }
  } catch (error: any) {
    console.error('KonfHub payment initiation error:', error);
    onFailure(error);
  }
};

/**
 * Handle payment failure
 */
export const handleKonfHubPaymentFailure = async (
  orderId: string,
  errorMessage?: string
): Promise<void> => {
  try {
    await fetch(`${API_BASE_URL}/payment/payment-failed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        orderId,
        error: errorMessage || 'Payment cancelled',
      }),
    });
  } catch (error: any) {
    console.error('Error reporting payment failure:', error);
  }
};

// Export for backward compatibility (if any components were using these names)
export const KONFHUB_ENABLED = true;
export const PAYMENT_PROVIDER = 'KonfHub';
