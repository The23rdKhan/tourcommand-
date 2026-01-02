# Logging Overview

## Current Logging in Codebase

### Console Logs Found

#### Error Logging (console.error)
The codebase uses `console.error` for error logging in these locations:

1. **components/Auth.tsx** (2 locations)
   - Line 76: Failed to create user profile (Login)
   - Line 302: Failed to create user profile (Signup)

2. **components/Onboarding.tsx**
   - Line 222: Error completing onboarding

3. **components/ShowDetail.tsx**
   - Line 45: Error updating show

4. **components/Settings.tsx** (3 locations)
   - Line 44: Error upgrading tier
   - Line 87: Error updating profile
   - Line 115: Error updating role

5. **components/CreateTourWizard.tsx**
   - Line 64: Error creating tour

6. **components/Vendors.tsx**
   - Line 36: Error creating vendor

7. **components/Venues.tsx**
   - Line 29: Error creating venue

8. **components/ErrorBoundary.tsx**
   - Line 25: ErrorBoundary caught an error

9. **components/Assistant.tsx**
   - Line 118: Error creating show

10. **context/TourContext.tsx** (2 locations)
    - Line 160: Error loading user profile
    - Line 215: Error loading data

11. **api/_helpers.ts**
    - Line 27: API Error

---

## Logging Patterns

### Current Pattern
```typescript
try {
  // ... code ...
} catch (error) {
  console.error('Error description:', error);
  // ... error handling ...
}
```

### Examples from Code
```typescript
// Auth.tsx
console.error('Failed to create user profile:', profileError);

// Onboarding.tsx
console.error('Error completing onboarding:', error);

// TourContext.tsx
console.error('Error loading user profile:', error);
```

---

## What's Missing

### No Structured Logging
- ❌ No log levels (debug, info, warn, error)
- ❌ No log formatting utility
- ❌ No production vs development logging
- ❌ No log aggregation service integration

### No Request Logging
- ❌ No API request/response logging
- ❌ No performance timing logs
- ❌ No request ID tracking

### No User Action Logging
- ✅ Analytics events exist (utils/analytics.ts)
- ❌ But no detailed action logs

---

## Recommendations

### Option 1: Simple Logger Utility (Recommended for now)

Create a simple logger that:
- Filters logs in production
- Formats logs consistently
- Adds timestamps
- Groups by log level

### Option 2: Use Existing Analytics
- `utils/analytics.ts` already tracks events
- Could extend to include error tracking
- Sends to Supabase `analytics_events` table

### Option 3: Production Logging Service
- Integrate Sentry for error tracking
- Or use Vercel's built-in error logs
- Or use a service like LogRocket

---

## Quick Check: Where to Look for Logs

### Browser Console
- **Open DevTools**: F12
- **Console Tab**: All `console.error`, `console.log`, etc.
- **Filter**: Click filter icon to show only errors

### Network Tab
- **Open DevTools**: F12
- **Network Tab**: See all API requests
- **Filter**: Filter by "XHR" or "Fetch" to see API calls
- **Click request**: See request/response details

### Supabase Logs
- Go to Supabase Dashboard
- **Logs** section (if available)
- See database query logs

---

## Current Logging Coverage

### ✅ What's Logged
- Profile creation errors
- Onboarding errors
- Tour/show creation errors
- Settings update errors
- API errors
- React error boundary errors

### ❌ What's NOT Logged
- Successful operations (only errors)
- User actions (except analytics events)
- Performance metrics
- API request/response details
- Authentication flow steps

---

## How to Debug Issues

### 1. Check Browser Console
```javascript
// Open DevTools (F12)
// Look for red errors in Console tab
```

### 2. Check Network Tab
```javascript
// Open DevTools (F12) → Network tab
// Look for failed requests (red status codes)
// Click on failed request to see error details
```

### 3. Check Supabase
- Go to Supabase Dashboard
- Check Table Editor for data
- Check Logs section (if available)

### 4. Add Temporary Logs
If you need more logging, temporarily add:
```typescript
console.log('DEBUG:', { variable1, variable2 });
```

---

## Next Steps

Would you like me to:
1. ✅ Create a simple logger utility?
2. ✅ Add more logging to specific areas?
3. ✅ Set up error tracking (Sentry)?
4. ✅ Document current logging better?

