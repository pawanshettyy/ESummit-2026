/**
 * Vercel Web Analytics Utilities
 * 
 * This module provides utilities for tracking custom events and analytics
 * with Vercel Web Analytics. Custom events require a Pro or Enterprise plan.
 */

/**
 * Track a custom event in Vercel Web Analytics
 * 
 * This function allows you to track custom user interactions and events
 * throughout your application. Events are useful for tracking conversions,
 * user engagement, and other important metrics.
 * 
 * Note: Custom events feature requires a Pro or Enterprise Vercel plan.
 * For Express backend, events are logged and would be collected via client-side tracking.
 * 
 * @param eventName - The name of the event (e.g., 'user_signup', 'purchase_complete')
 * @param eventData - Optional data to include with the event
 * 
 * @example
 * // Track user signup
 * trackEvent('user_signup', { plan: 'premium' });
 * 
 * // Track form submission
 * trackEvent('form_submit', { form_id: 'contact_form' });
 * 
 * // Track without additional data
 * trackEvent('button_click');
 */
export const trackEvent = (
  eventName: string,
  eventData?: Record<string, any>
): void => {
  try {
    // In a production environment with Pro/Enterprise plan,
    // this would send to Vercel's analytics service
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 [Analytics] Event tracked: ${eventName}`, eventData || '');
    }

    // For backend tracking, we log the event for monitoring purposes
    // Client-side analytics are collected via @vercel/analytics on frontend
  } catch (error) {
    // Silently fail analytics tracking to not disrupt application
    if (process.env.NODE_ENV === 'development') {
      console.warn('Analytics event tracking failed:', error);
    }
  }
};

/**
 * Track a performance metric
 * 
 * @param metricName - Name of the metric
 * @param value - Numeric value of the metric
 * @param unit - Unit of measurement (e.g., 'ms', 's')
 */
export const trackMetric = (
  metricName: string,
  value: number,
  unit: string = 'ms'
): void => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ [Analytics] Metric: ${metricName} = ${value}${unit}`);
    }

    // Track as a custom event
    trackEvent(`perf_${metricName}`, {
      value,
      unit,
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Analytics metric tracking failed:', error);
    }
  }
};

/**
 * Get analytics configuration status
 * 
 * Returns information about the analytics setup and whether
 * Vercel Web Analytics is enabled.
 */
export const getAnalyticsConfig = (): {
  enabled: boolean;
  environment: string;
  customEventsAvailable: boolean;
} => {
  return {
    enabled: process.env.VERCEL_ENV !== 'development',
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown',
    customEventsAvailable: process.env.VERCEL_ANALYTICS_CUSTOM_EVENTS === 'true',
  };
};

export default {
  trackEvent,
  trackMetric,
  getAnalyticsConfig,
};
