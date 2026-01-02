# Current Logging Audit - Complete List

## Summary
- **Total console statements**: ~30+ locations
- **Error logging**: 15+ locations
- **Info/debug logging**: 10+ locations (mostly in scripts)
- **Analytics logging**: 1 utility file
- **Error boundary**: 1 component

---

## 📋 Detailed Logging Inventory

### 1. **Error Logging (console.error)** - 15 Locations

#### Authentication & User Management
**components/Auth.tsx** (2 locations)
```typescript
Line 76:  console.error('Failed to create user profile:', profileError);  // Login flow
Line 302: console.error('Failed to create user profile:', profileError); // Signup flow
```

**components/Onboarding.tsx** (1 location)
```typescript
Line 222: console.error('Error completing onboarding:', error);
```

**context/TourContext.tsx** (2 locations)
```typescript
Line 160: console.error('Error loading user profile:', error);
Line 215: console.error('Error loading data:', error);
```

#### Tour & Show Management
**components/ShowDetail.tsx** (1 location)
```typescript
Line 45: console.error('Error updating show:', error);
```

**components/CreateTourWizard.tsx** (1 location)
```typescript
Line 64: console.error('Error creating tour:', error);
```

#### Settings & Profile
**components/Settings.tsx** (3 locations)
```typescript
Line 44:  console.error('Error upgrading tier:', error);
Line 87:  console.error('Error updating profile:', error);
Line 115: console.error('Error updating role:', error);
```

#### Vendors & Venues
**components/Vendors.tsx** (1 location)
```typescript
Line 36: console.error('Error creating vendor:', error);
```

**components/Venues.tsx** (1 location)
```typescript
Line 29: console.error('Error creating venue:', error);
```

#### AI Assistant
**components/Assistant.tsx** (1 location)
```typescript
Line 118: console.error('Error creating show:', error);
```

#### Error Boundary
**components/ErrorBoundary.tsx** (1 location)
```typescript
Line 25: console.error('ErrorBoundary caught an error:', error, errorInfo);
```

#### API Layer
**api/_helpers.ts** (1 location)
```typescript
Line 27: console.error('API Error:', error);
```

#### Analytics
**utils/analytics.ts** (2 locations)
```typescript
Line 19: console.error('Analytics error:', err);
Line 27: console.error('Analytics tracking failed:', error);
```

---

### 2. **Info/Debug Logging (console.log)** - 10+ Locations

#### Analytics (Development Only)
**utils/analytics.ts** (1 location)
```typescript
Line 24: console.log(`[Analytics] ${eventName}`, properties);  // Only in development
```

#### Scripts (Migration & Setup)
**scripts/run-migration-004.js** (6 locations)
```typescript
Line 93:  console.log('✅ Connected to Supabase database\n');
Line 99:  console.log('📄 Running Migration 004: Allow null role...\n');
Line 100: console.log('SQL to execute:');
Line 102: console.log(sql);
Line 103: console.log('─'.repeat(60));
Line 109: console.log('✅ Migration 004 completed successfully!');
```

**scripts/run-sql-direct.js** (3 locations)
```typescript
Line 74:  console.log('✅ Connected to Supabase database\n');
Line 87:  console.log(`📄 Running: ${migration.desc}...`);
Line 92:  console.log(`✅ ${migration.desc} completed\n`);
```

---

### 3. **Analytics Event Tracking**

**utils/analytics.ts** - Main analytics utility
```typescript
export const trackEvent = async (eventName: string, properties?: Record<string, any>)
```

**What it does:**
- Sends events to `/api/analytics/track` endpoint
- Stores in Supabase `analytics_events` table
- Logs to console in development mode
- Handles errors gracefully

**Where it's used:**
- Dashboard navigation
- Tour/show creation/updates
- Role changes
- Subscription upgrades
- And more (30+ files use it)

---

### 4. **Error Boundary Component**

**components/ErrorBoundary.tsx**
- Catches React component errors
- Logs errors to console
- Shows user-friendly error UI
- Has comment: "In production, send to error tracking service (Sentry, etc.)"

---

## 📊 Logging Coverage Analysis

### ✅ What's Logged

**Errors:**
- ✅ Profile creation failures
- ✅ Onboarding errors
- ✅ Data loading errors
- ✅ Tour/show creation errors
- ✅ Settings update errors
- ✅ API errors
- ✅ React error boundary errors
- ✅ Analytics tracking failures

**Info:**
- ✅ Analytics events (dev only)
- ✅ Migration script progress
- ✅ Database connection status

### ❌ What's NOT Logged

**Missing:**
- ❌ Successful operations (only errors logged)
- ❌ API request/response details
- ❌ Performance metrics
- ❌ User actions (except analytics events)
- ❌ Authentication flow steps
- ❌ Network request failures
- ❌ Form validation errors (only shown in UI)

---

## 🔍 Where to Find Logs

### Browser Console (F12)
**Console Tab:**
- All `console.error()` statements
- All `console.log()` statements (dev only for analytics)
- React error boundary errors
- Network errors

**Network Tab:**
- API request/response details
- Failed requests (red status codes)
- Request headers/body
- Response data

### Supabase Dashboard
- **Table Editor**:** `analytics_events` table (if analytics API works)
- **Logs Section**: Database query logs (if available)

### Vercel (Production)
- **Function Logs**: API route logs
- **Error Logs**: Server-side errors

---

## 📝 Logging Patterns

### Current Pattern (Error Handling)
```typescript
try {
  // ... operation ...
} catch (error) {
  console.error('Error description:', error);
  // ... error handling ...
}
```

### Current Pattern (Analytics)
```typescript
trackEvent('event_name', { property: value });
// Logs in dev: [Analytics] event_name { property: value }
// Sends to API in all environments
```

---

## 🎯 Logging Quality

### Strengths
- ✅ Errors are logged consistently
- ✅ Analytics events tracked
- ✅ Error boundary catches React errors
- ✅ Development logging for analytics

### Weaknesses
- ❌ No structured logging format
- ❌ No log levels (debug, info, warn, error)
- ❌ No production filtering (all logs show)
- ❌ No request/response logging
- ❌ No performance logging
- ❌ No user action logging (except analytics)

---

## 📌 Key Files

1. **utils/analytics.ts** - Analytics event tracking
2. **components/ErrorBoundary.tsx** - React error catching
3. **api/_helpers.ts** - API error handling
4. **components/Auth.tsx** - Authentication errors
5. **context/TourContext.tsx** - Data loading errors

---

## 🔧 Recommendations

### Immediate Improvements
1. Add request/response logging to API routes
2. Add performance timing logs
3. Filter logs in production
4. Add structured log format

### Future Enhancements
1. Integrate Sentry for error tracking
2. Add log aggregation service
3. Add user action logging
4. Add performance monitoring

---

**Last Updated**: After database migration setup
**Total Logging Locations**: ~30+

