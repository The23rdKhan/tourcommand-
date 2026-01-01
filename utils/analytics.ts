import { supabase } from '../lib/supabase';

export const trackEvent = async (eventName: string, properties?: Record<string, any>) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    // Send to backend API
    if (session) {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          eventName,
          properties
        })
      }).catch(err => console.error('Analytics error:', err));
    }

    // Also log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] ${eventName}`, properties);
    }
  } catch (error) {
    console.error('Analytics tracking failed:', error);
  }
};
