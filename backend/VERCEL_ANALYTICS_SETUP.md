# Vercel Web Analytics Setup Guide

This guide explains how Vercel Web Analytics has been integrated into the E-Summit 2026 backend and how to use it effectively.

## Overview

Vercel Web Analytics is now integrated into the Express backend to track API performance, response times, and custom events. The implementation follows Vercel's recommended approach for Node.js/Express applications.

## What's Been Implemented

### 1. **Analytics Middleware** (`src/middleware/analytics.middleware.ts`)

The analytics middleware is automatically applied to all requests and provides:

- **Response Time Tracking**: Measures and records the time taken for each request/response cycle
- **Custom Headers**: Adds `X-Response-Time` header to all responses for tracking
- **Cache Control Headers**: Sets appropriate cache headers for better analytics data collection

### 2. **Analytics Utilities** (`src/utils/analytics.util.ts`)

Utility functions for tracking events and metrics throughout your application:

- `trackEvent(eventName, eventData)` - Track custom user interactions
- `trackMetric(metricName, value, unit)` - Track performance metrics
- `getAnalyticsConfig()` - Get current analytics configuration status

### 3. **Integration in Express App** (`src/app.ts`)

The analytics middleware is integrated early in the middleware chain to ensure all requests and responses are tracked.

## Prerequisites

✅ **Already Completed:**
- `@vercel/analytics` package installed
- Middleware configured in Express app
- Utility functions ready for use

## Configuration Steps

### Step 1: Enable Web Analytics on Vercel Dashboard

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select the E-Summit 2026 project
3. Click the **Analytics** tab
4. Click **Enable** to activate Web Analytics

> **Note:** Enabling Web Analytics will add new routes (`/_vercel/insights/*`) after your next deployment.

### Step 2: Deploy to Vercel

Deploy your application using:

```bash
# If you have Vercel CLI installed
vercel deploy

# Or push to your Git repository, which auto-deploys to Vercel
git push origin main
```

### Step 3: Verify Analytics Collection

Once deployed:

1. Visit your deployed application on Vercel
2. Open browser Developer Tools (F12)
3. Go to the **Network** tab
4. Make a request to any API endpoint
5. Look for requests to `/_vercel/insights/view` - this confirms analytics is working

## Using Analytics in Your Code

### Track Custom Events

Track important user interactions and events:

```typescript
import { trackEvent } from '../utils/analytics.util';

// In a controller or service
export const handleUserSignup = async (req: Request, res: Response) => {
  try {
    // Your signup logic
    const user = await createUser(req.body);
    
    // Track the event (requires Pro or Enterprise plan)
    trackEvent('user_signup', { 
      plan: user.plan,
      source: 'api'
    });
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Signup failed' });
  }
};
```

### Track Performance Metrics

Monitor key performance indicators:

```typescript
import { trackMetric } from '../utils/analytics.util';

// Track database query performance
const startTime = Date.now();
const results = await database.query(sql);
const duration = Date.now() - startTime;

trackMetric('db_query_time', duration, 'ms');
```

### Get Analytics Configuration

Check if analytics is properly configured:

```typescript
import { getAnalyticsConfig } from '../utils/analytics.util';

const config = getAnalyticsConfig();
console.log('Analytics enabled:', config.enabled);
console.log('Environment:', config.environment);
console.log('Custom events available:', config.customEventsAvailable);
```

## What Gets Tracked Automatically

The analytics middleware automatically tracks:

- ✅ All incoming HTTP requests
- ✅ Response status codes
- ✅ Response times (`X-Response-Time` header)
- ✅ API endpoint popularity
- ✅ Error rates
- ✅ User agent and device information
- ✅ Geographic data (if enabled on Vercel)

## Viewing Analytics Data

Once your application is deployed and receiving traffic:

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select the E-Summit 2026 project
3. Click the **Analytics** tab
4. Explore the data through available panels:
   - Request volume
   - Response times
   - Top endpoints
   - Error rates
   - Geographic distribution
   - Device types

## Advanced Features (Pro/Enterprise Plans)

### Custom Events Tracking

With a Pro or Enterprise Vercel plan, you can track custom events:

```typescript
trackEvent('event_name', { key: 'value' });
```

**Available event data:**
- User interactions (button clicks, form submissions)
- Conversion tracking (purchases, signups)
- Feature usage (API features accessed)
- Business metrics (revenue, user segments)

### Filtering Analytics Data

In the Vercel Dashboard Analytics tab, you can:

- Filter by date range
- Group by different dimensions
- Compare metrics over time
- Set up custom dashboards

## Environment Variables

Optional environment variables for analytics configuration:

```bash
# Set to false to disable analytics in specific environments
VERCEL_ANALYTICS_ENABLED=true

# Enable custom events (Pro/Enterprise plan required)
VERCEL_ANALYTICS_CUSTOM_EVENTS=true
```

## Troubleshooting

### Analytics Data Not Appearing

1. **Verify deployment**: Make sure your app is deployed to Vercel
2. **Check analytics is enabled**: Confirm in Vercel Dashboard → Analytics → Enabled
3. **Wait for data collection**: It may take a few minutes for initial data to appear
4. **Check browser console**: Look for any error messages

### Network Request to `/_vercel/insights/*` Not Appearing

1. Ensure Web Analytics is enabled in Vercel Dashboard
2. Verify the app is deployed to Vercel (not running locally)
3. Check that your deployment was successful
4. Clear browser cache and reload

### Custom Events Not Tracking

1. Verify you have a Pro or Enterprise Vercel plan
2. Ensure `trackEvent()` is being called correctly
3. Check for JavaScript errors in the browser console
4. Verify the event name follows naming conventions (alphanumeric, underscores)

## Performance Considerations

- **Minimal Overhead**: Analytics middleware has minimal impact on response times
- **Non-blocking**: Analytics data collection is asynchronous
- **Privacy-focused**: No sensitive user data is collected by default
- **Automatic Cleanup**: Old analytics data is automatically purged

## Privacy and Compliance

Vercel Web Analytics is designed with privacy in mind:

- ✅ No cookies required
- ✅ No personal data collection by default
- ✅ GDPR compliant
- ✅ Can be disabled per page/route if needed
- ✅ Transparent data handling

For more details, see [Vercel's Privacy Policy](https://vercel.com/docs/analytics/privacy-policy).

## Best Practices

1. **Track Meaningful Events**: Only track events that provide business value
2. **Use Consistent Naming**: Use kebab-case for event names (e.g., `user_signup`)
3. **Include Context**: Always include relevant data with events
4. **Monitor Performance**: Check if analytics middleware impacts response times
5. **Review Regularly**: Check analytics dashboard weekly to spot trends

## Useful Links

- [Vercel Web Analytics Docs](https://vercel.com/docs/analytics)
- [Analytics Package Documentation](https://vercel.com/docs/analytics/package)
- [Custom Events Guide](https://vercel.com/docs/analytics/custom-events)
- [Filtering and Dashboards](https://vercel.com/docs/analytics/filtering)
- [Pricing Information](https://vercel.com/docs/analytics/limits-and-pricing)
- [Troubleshooting Guide](https://vercel.com/docs/analytics/troubleshooting)

## Next Steps

1. ✅ Code is ready - analytics middleware is integrated
2. 📤 **Deploy to Vercel** - Push your changes to trigger deployment
3. 🔍 **Enable Analytics** - Activate in Vercel Dashboard if not already done
4. 📊 **Monitor Data** - Check the Analytics tab after a few minutes
5. 🎯 **Add Custom Events** - Use `trackEvent()` for important user interactions

## Support

For issues or questions:
- Check [Vercel Analytics Documentation](https://vercel.com/docs/analytics)
- Review this setup guide
- Check the troubleshooting section above
- Contact Vercel support through your dashboard
