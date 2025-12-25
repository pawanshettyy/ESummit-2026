import logger from '../utils/logger.util';
import prisma from '../config/database';

/**
 * KonfHub API Integration Service
 * Provides end-to-end pass and ticketing solutions
 * API Documentation: https://docs.konfhub.com/
 */

const KONFHUB_API_KEY = process.env.KONFHUB_API_KEY || '';
const KONFHUB_EVENT_ID = process.env.KONFHUB_EVENT_ID || '';
const KONFHUB_API_BASE_URL = process.env.KONFHUB_API_URL || 'https://api.konfhub.com';

// Ticket IDs from KonfHub for TCET E-Summit 2026
export const KONFHUB_TICKET_IDS = {
  PIXEL_PASS: process.env.KONFHUB_PIXEL_PASS_ID || '68637',
  SILICON_PASS: process.env.KONFHUB_SILICON_PASS_ID || '68638',
  QUANTUM_PASS: process.env.KONFHUB_QUANTUM_PASS_ID || '68639',
  TCET_STUDENT_PASS: process.env.KONFHUB_TCET_STUDENT_PASS_ID || '', // Free pass for TCET students
};

// Custom form IDs from KonfHub
export const KONFHUB_CUSTOM_FORM_IDS = {
  COLLEGE: '117634',
};

export interface KonfHubTicketType {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  quantity?: number;
  availableQuantity?: number;
}

export interface KonfHubCaptureRequest {
  eventId: string;
  registrationTz?: string;
  ticketId: string;
  attendees: Array<{
    name: string;
    email: string;
    phone?: string;
    countryCode?: string;
    dialCode?: string;
    college?: string;
    whatsappNumber?: string;
    waCountryCode?: string;
    waDialCode?: string;
    whatsappConsent?: boolean;
    customForms?: Record<string, string>;
  }>;
  utm?: {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };
}

export interface KonfHubCaptureResponse {
  bookingIds: string[];
  type: string;
  message: string;
  title: string;
  url: Record<string, {
    ticket?: string;
    invoice?: string;
    name?: string;
    ticketName?: string;
  }>;
}

export interface KonfHubOrderRequest {
  eventId?: string;
  ticketTypeId?: string;
  quantity: number;
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  metadata?: Record<string, any>;
}

export interface KonfHubOrderResponse {
  orderId: string;
  ticketId?: string;
  paymentId?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  tickets?: Array<{
    id: string;
    ticketNumber: string;
    qrCode?: string;
  }>;
  paymentUrl?: string;
  checkoutUrl?: string;
}

export interface KonfHubWebhookPayload {
  event: 'order.completed' | 'order.cancelled' | 'ticket.issued';
  orderId: string;
  ticketId?: string;
  paymentId?: string;
  status: string;
  data: Record<string, any>;
}

class KonfHubService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = KONFHUB_API_KEY;
    this.baseUrl = KONFHUB_API_BASE_URL;

    if (!this.apiKey) {
      logger.warn('KonfHub API key not configured');
    }
  }

  /**
   * Create a new order/ticket purchase
   */
  async createOrder(orderData: KonfHubOrderRequest): Promise<KonfHubOrderResponse> {
    try {
      logger.info('Creating KonfHub order', { 
        email: orderData.customerInfo.email,
        quantity: orderData.quantity 
      });

      const response = await fetch(`${this.baseUrl}/v1/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-API-Version': '1.0',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const error = await response.json() as any;
        throw new Error(error.message || 'Failed to create KonfHub order');
      }

      const data = await response.json() as any;
      logger.info('KonfHub order created successfully', { orderId: data.orderId });

      return {
        orderId: data.id || data.orderId,
        ticketId: data.ticketId,
        paymentId: data.paymentId,
        status: data.status || 'pending',
        amount: data.amount || orderData.quantity * (data.price || 0),
        currency: data.currency || 'INR',
        tickets: data.tickets,
        paymentUrl: data.paymentUrl,
        checkoutUrl: data.checkoutUrl || data.paymentUrl,
      };
    } catch (error) {
      logger.error('KonfHub create order error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to create order with KonfHub');
    }
  }

  /**
   * Get order details by order ID
   */
  async getOrder(orderId: string): Promise<KonfHubOrderResponse> {
    try {
      logger.info('Fetching KonfHub order', { orderId });

      const response = await fetch(`${this.baseUrl}/v1/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-API-Version': '1.0',
        },
      });

      if (!response.ok) {
        const error = await response.json() as any;
        throw new Error(error.message || 'Failed to fetch KonfHub order');
      }

      const data = await response.json() as any;

      return {
        orderId: data.id || data.orderId,
        ticketId: data.ticketId,
        paymentId: data.paymentId,
        status: data.status,
        amount: data.amount,
        currency: data.currency || 'INR',
        tickets: data.tickets,
      };
    } catch (error) {
      logger.error('KonfHub get order error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch order from KonfHub');
    }
  }

  /**
   * Capture/Register a free ticket for an attendee
   * Uses the KonfHub Capture Ticket API: POST /event/capture/v2
   * 
   * @param request - Registration details
   * @returns Booking IDs and ticket URLs
   */
  async captureTicket(request: KonfHubCaptureRequest): Promise<KonfHubCaptureResponse> {
    try {
      const eventId = request.eventId || KONFHUB_EVENT_ID;
      
      if (!eventId) {
        throw new Error('Event ID not provided');
      }

      if (!this.apiKey) {
        throw new Error('KONFHUB_API_KEY not configured');
      }

      // Build registration details in KonfHub format
      const registrationDetails: Record<string, any[]> = {};
      registrationDetails[request.ticketId] = request.attendees.map(attendee => ({
        name: attendee.name,
        email_id: attendee.email,
        phone_number: attendee.phone || '',
        country_code: attendee.countryCode || 'in',
        dial_code: attendee.dialCode || '+91',
        whatsapp_number: attendee.whatsappNumber || attendee.phone || '',
        wa_country_code: attendee.waCountryCode || 'in',
        wa_dial_code: attendee.waDialCode || '+91',
        whatsapp_consent: attendee.whatsappConsent ?? true,
        custom_forms: {
          [KONFHUB_CUSTOM_FORM_IDS.COLLEGE]: attendee.college || '',
          ...attendee.customForms,
        },
      }));

      const requestBody = {
        event_id: eventId,
        registration_tz: request.registrationTz || 'Asia/Kolkata',
        registration_details: registrationDetails,
        ...(request.utm && {
          utm: {
            utm_source: request.utm.utmSource || '',
            utm_medium: request.utm.utmMedium || '',
            utm_campaign: request.utm.utmCampaign || '',
          },
        }),
      };

      logger.info('Capturing KonfHub ticket', {
        eventId,
        ticketId: request.ticketId,
        attendeeCount: request.attendees.length,
        emails: request.attendees.map(a => a.email),
      });

      const response = await fetch(`${this.baseUrl}/event/capture/v2`, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error('KonfHub capture ticket error', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        });
        throw new Error(`KonfHub capture error: ${response.status} - ${errorText}`);
      }

      const data = await response.json() as any;
      
      logger.info('KonfHub ticket captured successfully', {
        bookingIds: data.booking_id,
        type: data.type,
      });

      return {
        bookingIds: data.booking_id || [],
        type: data.type,
        message: data.message,
        title: data.title,
        url: data.url || {},
      };
    } catch (error) {
      logger.error('KonfHub capture ticket error:', error);
      throw error;
    }
  }

  /**
   * Register a free TCET student pass
   * Creates the registration on KonfHub and saves to local database
   */
  async registerFreePass(params: {
    name: string;
    email: string;
    phone: string;
    college: string;
    ticketId?: string;
    userId?: string;
  }): Promise<{
    success: boolean;
    bookingId?: string;
    ticketUrl?: string;
    pass?: any;
  }> {
    try {
      const ticketId = params.ticketId || KONFHUB_TICKET_IDS.TCET_STUDENT_PASS;
      
      if (!ticketId) {
        throw new Error('TCET Student Pass ticket ID not configured');
      }

      // Capture ticket on KonfHub
      const captureResult = await this.captureTicket({
        eventId: KONFHUB_EVENT_ID,
        ticketId,
        attendees: [{
          name: params.name,
          email: params.email,
          phone: params.phone,
          college: params.college,
        }],
      });

      if (!captureResult.bookingIds || captureResult.bookingIds.length === 0) {
        throw new Error('No booking ID returned from KonfHub');
      }

      const bookingId = captureResult.bookingIds[0];
      const ticketUrl = captureResult.url[bookingId]?.ticket;

      // Save to local database
      let user;
      if (params.userId) {
        user = await prisma.user.findUnique({ where: { id: params.userId } });
      }
      if (!user) {
        user = await prisma.user.findUnique({ where: { email: params.email.toLowerCase() } });
      }

      if (user) {
        // Create pass in local database
        const pass = await prisma.pass.create({
          data: {
            userId: user.id,
            passType: 'TCET Student Pass',
            passId: bookingId,
            bookingId,
            konfhubTicketId: ticketId,
            price: 0,
            purchaseDate: new Date(),
            status: 'Active',
            qrCodeUrl: ticketUrl,
            qrCodeData: bookingId,
            ticketDetails: {
              attendeeName: params.name,
              email: params.email,
              phone: params.phone,
              college: params.college,
              ticketName: 'TCET Student Pass',
              registeredAt: new Date().toISOString(),
              registrationStatus: 'Active',
              source: 'api_capture',
            },
          },
        });

        return {
          success: true,
          bookingId,
          ticketUrl,
          pass,
        };
      }

      return {
        success: true,
        bookingId,
        ticketUrl,
      };
    } catch (error) {
      logger.error('Register free pass error:', error);
      throw error;
    }
  }

  /**
   * Verify webhook signature (if KonfHub provides webhook signatures)
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      // Implement webhook signature verification based on KonfHub's documentation
      // This is a placeholder - update with actual verification logic
      const crypto = require('crypto');
      const webhookSecret = process.env.KONFHUB_WEBHOOK_SECRET || '';
      
      if (!webhookSecret) {
        logger.warn('KonfHub webhook secret not configured');
        return true; // Allow in development
      }

      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(payload)
        .digest('hex');

      return expectedSignature === signature;
    } catch (error) {
      logger.error('KonfHub webhook verification error:', error);
      return false;
    }
  }

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: string): Promise<{ success: boolean; message: string }> {
    try {
      logger.info('Cancelling KonfHub order', { orderId });

      const response = await fetch(`${this.baseUrl}/v1/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-API-Version': '1.0',
        },
      });

      if (!response.ok) {
        const error = await response.json() as any;
        throw new Error(error.message || 'Failed to cancel KonfHub order');
      }

      return {
        success: true,
        message: 'Order cancelled successfully',
      };
    } catch (error) {
      logger.error('KonfHub cancel order error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to cancel order');
    }
  }

  /**
   * Get ticket details
   */
  async getTicket(ticketId: string): Promise<any> {
    try {
      logger.info('Fetching KonfHub ticket', { ticketId });

      const response = await fetch(`${this.baseUrl}/v1/tickets/${ticketId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-API-Version': '1.0',
        },
      });

      if (!response.ok) {
        const error = await response.json() as any;
        throw new Error(error.message || 'Failed to fetch KonfHub ticket');
      }

      return await response.json() as any;
    } catch (error) {
      logger.error('KonfHub get ticket error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch ticket from KonfHub');
    }
  }

  /**
   * Fetch all attendees from KonfHub API
   * Uses the private API endpoint: GET /developers/event/:event-id/attendees/private
   * 
   * @param options - Query options for filtering and pagination
   * @returns Array of attendee details
   */
  async fetchAllAttendees(options: {
    limit?: number;
    offset?: number;
    registrationStatus?: string; // '2' for ACTIVE, '3' for CANCELLED
    searchValue?: string;
  } = {}): Promise<{
    eventName: string;
    attendees: any[];
    count: number;
    resultsCount: number;
  }> {
    try {
      const eventId = KONFHUB_EVENT_ID;
      
      if (!eventId) {
        throw new Error('KONFHUB_EVENT_ID not configured');
      }

      if (!this.apiKey) {
        throw new Error('KONFHUB_API_KEY not configured');
      }

      const queryParams = new URLSearchParams();
      if (options.limit) queryParams.append('limit', options.limit.toString());
      if (options.offset) queryParams.append('offset', options.offset.toString());
      if (options.registrationStatus) queryParams.append('registration_status', options.registrationStatus);
      if (options.searchValue) queryParams.append('search_value', options.searchValue);

      const url = `${this.baseUrl}/developers/event/${eventId}/attendees/private?${queryParams.toString()}`;
      
      logger.info('Fetching attendees from KonfHub', { 
        eventId, 
        options,
        url: url.replace(this.apiKey, '***')
      });

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error('KonfHub API error', { 
          status: response.status, 
          statusText: response.statusText,
          error: errorText 
        });
        throw new Error(`KonfHub API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json() as any;
      
      logger.info('Fetched attendees from KonfHub', {
        eventName: data.event_name,
        count: data.count,
        resultsCount: data.results_count,
      });

      return {
        eventName: data.event_name,
        attendees: data.participant_details || [],
        count: data.count || 0,
        resultsCount: data.results_count || 0,
      };
    } catch (error) {
      logger.error('KonfHub fetch attendees error:', error);
      throw error;
    }
  }

  /**
   * Sync all attendees from KonfHub to local database
   * Creates/updates users and passes based on KonfHub data
   */
  async syncAttendeesToDatabase(): Promise<{
    created: number;
    updated: number;
    skipped: number;
    errors: any[];
    total: number;
  }> {
    const results = {
      created: 0,
      updated: 0,
      skipped: 0,
      errors: [] as any[],
      total: 0,
    };

    try {
      // Fetch all active attendees (registration_status=2 means ACTIVE)
      let offset = 0;
      const limit = 100;
      let hasMore = true;
      const allAttendees: any[] = [];

      // Paginate through all attendees
      while (hasMore) {
        const { attendees, count } = await this.fetchAllAttendees({
          limit,
          offset,
          registrationStatus: '2', // Only active registrations
        });

        allAttendees.push(...attendees);
        offset += limit;
        hasMore = allAttendees.length < count;

        logger.info(`Fetched ${allAttendees.length}/${count} attendees`);
      }

      results.total = allAttendees.length;
      const syncBatchId = `sync_${Date.now()}`;

      logger.info(`Starting sync of ${allAttendees.length} attendees`);

      for (let i = 0; i < allAttendees.length; i++) {
        const attendee = allAttendees[i];
        
        try {
          const email = attendee.email_id?.toLowerCase().trim();
          
          if (!email) {
            results.skipped++;
            continue;
          }

          // Find or create user
          let user = await prisma.user.findUnique({ where: { email } });

          if (!user) {
            user = await prisma.user.create({
              data: {
                email,
                fullName: attendee.name || email.split('@')[0],
                clerkUserId: `konfhub_${syncBatchId}_${i}`,
                ...(attendee.institution && { college: attendee.institution }),
                ...(attendee.organisation && { college: attendee.organisation }),
                ...(attendee.phone_number && { phone: attendee.phone_number }),
              },
            });
            logger.debug(`Created user for ${email}`);
          }

          // Check for existing pass by booking_id
          const bookingId = attendee.booking_id;
          const existingPass = bookingId 
            ? await prisma.pass.findFirst({ where: { bookingId } })
            : null;

          // Build comprehensive ticket details
          const ticketDetails = {
            // Attendee Details
            attendeeName: attendee.name,
            email: attendee.email_id,
            country: attendee.country,
            countryCode: attendee.country_code,
            dialCode: attendee.dial_code,
            phone: attendee.phone_number,
            designation: attendee.designation,
            organisation: attendee.organisation,
            institution: attendee.institution,
            linkedinUrl: attendee.linkedin_url,
            tShirtSize: attendee.t_shirt_size,
            gender: attendee.gender,
            bloodGroup: attendee.blood_group,
            dateOfBirth: attendee.date_of_birth,
            emergencyContactName: attendee.emergency_contact_name,
            emergencyContactNumber: attendee.emergency_contact_number,
            
            // WhatsApp Details
            whatsappNumber: attendee.whatsapp_number,
            waCountryCode: attendee.wa_country_code,
            waDialCode: attendee.wa_dial_code,
            whatsappConsent: attendee.whatsapp_consent,
            
            // Registration Details
            couponCode: attendee.coupon_code || attendee.discount_code,
            paymentId: attendee.payment_id,
            ticketName: attendee.ticket_name || attendee.ticket_type,
            registeredAt: attendee.registered_at,
            registrationStatus: attendee.registration_status,
            bookingId: attendee.booking_id,
            registrationId: attendee.registration_id,
            ticketId: attendee.ticket_id,
            ticketPrice: attendee.ticket_price,
            amountPaid: attendee.amount_paid,
            balanceAmount: attendee.balance_amount,
            refundAmount: attendee.refund_amount,
            refundType: attendee.refund_type,
            
            // UTM Details
            utmSource: attendee.utm_source,
            utmMedium: attendee.utm_medium,
            utmCampaign: attendee.utm_campaign,
            
            // Custom forms
            customForms: attendee.custom_forms || attendee.misc,
            
            // Sync metadata
            syncedAt: new Date().toISOString(),
            syncBatchId,
            syncedFrom: 'konfhub_api',
          };

          // Determine pass status
          let status = 'Pending';
          const regStatus = attendee.registration_status?.toString().toLowerCase();
          if (regStatus === 'active' || regStatus === '2') {
            status = 'Active';
          } else if (regStatus === 'cancelled' || regStatus === '3') {
            status = 'Cancelled';
          }

          // Parse purchase date
          let purchaseDate = new Date();
          if (attendee.registered_at) {
            try {
              purchaseDate = new Date(attendee.registered_at);
              if (isNaN(purchaseDate.getTime())) {
                purchaseDate = new Date();
              }
            } catch {
              purchaseDate = new Date();
            }
          }

          const passData = {
            userId: user.id,
            passType: attendee.ticket_name || attendee.ticket_type || 'General Pass',
            passId: bookingId || `PASS-${syncBatchId}-${i}`,
            bookingId: bookingId || null,
            konfhubTicketId: attendee.ticket_id?.toString() || null,
            konfhubOrderId: attendee.payment_id || null,
            price: parseFloat(attendee.amount_paid) || parseFloat(attendee.ticket_price) || 0,
            purchaseDate,
            ticketDetails,
            qrCodeData: bookingId || null,
            status,
          };

          if (existingPass) {
            await prisma.pass.update({
              where: { id: existingPass.id },
              data: {
                price: passData.price,
                purchaseDate: passData.purchaseDate,
                ticketDetails: passData.ticketDetails,
                status: passData.status,
              },
            });
            results.updated++;
          } else {
            await prisma.pass.create({ data: passData });
            results.created++;
          }

        } catch (error: any) {
          logger.error(`Error syncing attendee ${i}:`, error);
          results.errors.push({
            index: i,
            email: attendee.email_id,
            bookingId: attendee.booking_id,
            error: error.message,
          });
        }
      }

      logger.info('KonfHub sync completed', results);
      return results;

    } catch (error) {
      logger.error('KonfHub sync error:', error);
      throw error;
    }
  }

  /**
   * Check if API is properly configured
   */
  isConfigured(): boolean {
    return !!(this.apiKey && KONFHUB_EVENT_ID);
  }

  /**
   * Get configuration status
   */
  getConfigStatus(): { apiKey: boolean; eventId: boolean; baseUrl: string } {
    return {
      apiKey: !!this.apiKey,
      eventId: !!KONFHUB_EVENT_ID,
      baseUrl: this.baseUrl,
    };
  }
}

export const konfhubService = new KonfHubService();
