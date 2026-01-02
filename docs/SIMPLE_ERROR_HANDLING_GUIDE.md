# Simple Error Handling Guide

## ✅ What We've Set Up

A simple, straightforward approach to catch **ALL errors** in your app:

1. **Centralized Logger** (`utils/logger.ts`)
   - One place for all error logging
   - Formats errors consistently
   - Stores recent errors in memory
   - Ready to send to error service (optional)

2. **Global Error Handlers** (`utils/errorHandler.ts`)
   - Catches JavaScript errors (`window.onerror`)
   - Catches unhandled promise rejections
   - Catches resource loading errors (images, scripts)
   - Automatically initialized in `App.tsx`

3. **Updated ErrorBoundary**
   - Now uses the centralized logger
   - Catches React component errors

---

## 🎯 How It Works

### Automatic Error Catching

**These are caught automatically:**
- ✅ JavaScript errors (`throw new Error()`)
- ✅ Unhandled promise rejections
- ✅ React component errors (via ErrorBoundary)
- ✅ Resource loading errors (images, scripts)
- ✅ Network errors (if you add fetch interceptor)

### Manual Error Logging

**Replace existing `console.error` with:**
```typescript
import { logError } from '../utils/logger';

// Instead of:
console.error('Error message', error);

// Use:
logError('Error message', error, { context: 'optional context' });
```

---

## 📝 Quick Migration Guide

### Step 1: Replace console.error

**Before:**
```typescript
try {
  // ... code ...
} catch (error) {
  console.error('Error creating tour:', error);
}
```

**After:**
```typescript
import { logError } from '../utils/logger';

try {
  // ... code ...
} catch (error) {
  logError('Error creating tour', error, { tourId: '123' });
}
```

### Step 2: That's It!

The global handlers catch everything else automatically.

---

## 🔍 Where Errors Are Logged

### Browser Console
All errors appear in console with `[ERROR]` prefix:
```
[ERROR] Failed to create user profile Error: ...
[ERROR] JavaScript Error: ... 
[ERROR] Unhandled Promise Rejection ...
```

### Error Buffer
Recent errors are stored in memory (last 50):
```typescript
import { logger } from './utils/logger';
const recentErrors = logger.getRecentErrors();
```

---

## 🚀 Usage Examples

### Basic Error Logging
```typescript
import { logError } from '../utils/logger';

try {
  await createTour(tourData);
} catch (error) {
  logError('Failed to create tour', error);
}
```

### With Context
```typescript
logError('Failed to update show', error, {
  showId: show.id,
  tourId: tour.id,
  userId: user.id
});
```

### Info/Debug Logging (Development Only)
```typescript
import { logInfo, logDebug } from '../utils/logger';

logInfo('User logged in', { userId: user.id });
logDebug('API response', response);
```

---

## 📊 What Gets Logged

Each error includes:
- ✅ Error message
- ✅ Error object (stack trace)
- ✅ Context (optional custom data)
- ✅ Timestamp
- ✅ URL where error occurred
- ✅ User agent (browser info)

---

## 🔧 Optional: Send to API

The logger is ready to send errors to your API. Just uncomment in `utils/logger.ts`:

```typescript
// In logger.error() method, uncomment:
this.sendToAPI(logEntry);
```

Then create `/api/errors/log.ts` endpoint to receive errors.

---

## ✅ Already Updated

These files are already using the new logger:
- ✅ `components/ErrorBoundary.tsx`
- ✅ `components/Auth.tsx` (2 places)
- ✅ `App.tsx` (global handlers setup)

---

## 📋 Next Steps

1. **Gradually replace** `console.error` with `logError` in other files
2. **Test it** - trigger some errors and check console
3. **Optional** - Create API endpoint to store errors in database

---

## 🎯 Benefits

- ✅ **One place** for all error logging
- ✅ **Consistent format** - easier to debug
- ✅ **Automatic catching** - no need to wrap everything
- ✅ **Context included** - know where errors happened
- ✅ **Ready for production** - can send to error service

---

**That's it!** Simple, straightforward error handling. 🎉

