# Code Review: Onboarding Component Improvements

**Reviewer:** Senior Developer  
**Date:** 2025-01-01  
**Component:** `components/Onboarding.tsx`

---

## 🔴 Critical Issues

### 1. **Memory Leak: setTimeout Not Cleaned Up**
**Location:** Lines 146, 193

**Issue:**
```typescript
setTimeout(() => {
  navigate(`/app/venues/${newVenue.id}`);
}, 500);
```

**Problem:** If component unmounts before timeout completes, navigation still fires. This can cause:
- Navigation to wrong route
- State updates on unmounted component
- Memory leaks

**Fix:**
```typescript
const timeoutRef = useRef<NodeJS.Timeout | null>(null);

// In handleFinish:
timeoutRef.current = setTimeout(() => {
  navigate(`/app/venues/${newVenue.id}`);
}, 500);

// Add cleanup:
useEffect(() => {
  return () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
}, []);
```

**Severity:** HIGH - Can cause bugs in production

---

### 2. **useEffect Missing Dependency**
**Location:** Line 39-43

**Issue:**
```typescript
useEffect(() => {
  if (user?.name && !profile.name) {
    setProfile(prev => ({ ...prev, name: user.name }));
  }
}, [user]); // Missing profile.name dependency
```

**Problem:** ESLint will warn, and could cause stale closure issues. However, the logic is correct - we only want to run when `user` changes, not when `profile.name` changes.

**Fix:** Add ESLint disable comment with explanation:
```typescript
useEffect(() => {
  if (user?.name && !profile.name) {
    setProfile(prev => ({ ...prev, name: user.name }));
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [user]); // Intentionally only depend on user - we don't want to re-run when profile.name changes
```

**Severity:** MEDIUM - Works but triggers lint warnings

---

### 3. **Unsafe Type Assertion**
**Location:** Line 339

**Issue:**
```typescript
onClick={() => setProfile({...profile, role: role.id as any})}
```

**Problem:** Using `as any` bypasses type safety. If `role.id` doesn't match the expected type, runtime error.

**Fix:**
```typescript
onClick={() => setProfile({...profile, role: role.id as 'Artist' | 'Manager' | 'Operator'})}
```

Or better, type the role array:
```typescript
const roles: Array<{id: 'Artist' | 'Manager' | 'Operator', label: string, sub: string, icon: React.ComponentType}> = [
  { id: 'Artist', label: 'Artist / Musician', sub: '...', icon: Music2 },
  // ...
];
```

**Severity:** MEDIUM - Type safety issue

---

## 🟡 Important Issues

### 4. **Error Type Too Broad**
**Location:** Line 197

**Issue:**
```typescript
catch (error: any) {
  const errorMessage = error.message || 'Failed to complete setup. Please try again.';
```

**Problem:** `any` type loses type safety. Should handle specific error types.

**Fix:**
```typescript
catch (error: unknown) {
  const errorMessage = error instanceof Error 
    ? error.message 
    : 'Failed to complete setup. Please try again.';
  setError(errorMessage);
  addToast(errorMessage, 'error');
  console.error('Error completing onboarding:', error);
}
```

**Severity:** MEDIUM - Better error handling

---

### 5. **Date Validation Timezone Issue**
**Location:** Line 56-61

**Issue:**
```typescript
const isFutureDate = (date: string) => {
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today;
};
```

**Problem:** Date string parsing can be timezone-dependent. `new Date('2025-01-01')` may parse as UTC midnight, which could be yesterday in some timezones.

**Fix:**
```typescript
const isFutureDate = (date: string) => {
  const selectedDate = new Date(date + 'T00:00:00'); // Force local time
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today;
};
```

Or use date-fns or similar library for better date handling.

**Severity:** MEDIUM - Edge case that could cause issues

---

### 6. **parseInt Without Validation**
**Location:** Line 501

**Issue:**
```typescript
onChange={e => setVenueData({...venueData, capacity: parseInt(e.target.value)})}
```

**Problem:** `parseInt('')` returns `NaN`, which could cause issues. Also, negative numbers are allowed in input but validation catches them later.

**Fix:**
```typescript
onChange={e => {
  const value = e.target.value;
  const numValue = value === '' ? 0 : parseInt(value, 10);
  if (!isNaN(numValue)) {
    setVenueData({...venueData, capacity: numValue});
  }
}}
```

Or use controlled input with validation:
```typescript
onChange={e => {
  const value = e.target.value;
  if (value === '' || /^\d+$/.test(value)) {
    setVenueData({...venueData, capacity: value === '' ? 0 : parseInt(value, 10)});
  }
}}
```

**Severity:** MEDIUM - Could cause NaN issues

---

### 7. **Validation Function Duplication**
**Location:** Lines 63-101

**Issue:** Multiple `.trim()` calls on same strings. Could be optimized.

**Current:**
```typescript
if (!tourData.name.trim()) {
  return 'Tour name is required';
}
if (tourData.name.trim().length < 2) { // trim() called twice
  return 'Tour name must be at least 2 characters';
}
```

**Fix:**
```typescript
const validateTourData = () => {
  const trimmedName = tourData.name.trim();
  if (!trimmedName) {
    return 'Tour name is required';
  }
  if (trimmedName.length < 2) {
    return 'Tour name must be at least 2 characters';
  }
  // ...
};
```

**Severity:** LOW - Performance optimization

---

## 🟢 Minor Issues / Improvements

### 8. **Missing Accessibility Attributes**
**Location:** Lines 337-354 (role selection buttons)

**Issue:** Role selection buttons lack ARIA labels and keyboard navigation hints.

**Fix:**
```typescript
<button
  key={role.id}
  onClick={() => setProfile({...profile, role: role.id as 'Artist' | 'Manager' | 'Operator'})}
  aria-label={`Select ${role.label} role`}
  aria-pressed={profile.role === role.id}
  role="radio"
  className={...}
>
```

**Severity:** LOW - Accessibility improvement

---

### 9. **Error State Not Cleared on Step Change**
**Location:** Line 365, 445, 516

**Issue:** When user clicks "Back" or changes step, error state persists. Should clear errors.

**Fix:**
```typescript
onClick={() => {
  setError(null); // Clear errors when going back
  setStep(1);
}}
```

**Severity:** LOW - UX improvement

---

### 10. **Email Verification Check Could Be More Robust**
**Location:** Line 46-53

**Issue:** Email verification check runs on every session change, but doesn't handle errors.

**Fix:**
```typescript
useEffect(() => {
  const checkEmailVerification = async () => {
    if (session?.user) {
      try {
        setEmailVerified(session.user.email_confirmed_at !== null);
      } catch (error) {
        console.error('Error checking email verification:', error);
        // Default to true to not block user
        setEmailVerified(true);
      }
    } else {
      setEmailVerified(true);
    }
  };
  checkEmailVerification();
}, [session]);
```

**Severity:** LOW - Edge case handling

---

### 11. **Missing Error Boundary for Validation**
**Location:** Validation functions

**Issue:** If validation functions throw (unlikely but possible), no error handling.

**Current:** Validation functions are pure, so this is low risk, but could add try-catch if needed.

**Severity:** VERY LOW - Defensive programming

---

## ✅ What's Good

1. **Good separation of concerns** - Validation functions are separate
2. **Proper error handling** - Try-catch blocks in place
3. **User feedback** - Toast notifications implemented
4. **Loading states** - Proper loading UI
5. **Type safety** - Mostly good TypeScript usage
6. **Validation logic** - Comprehensive validation rules
7. **Error display** - Clear error messages in UI

---

## 📋 Recommended Fixes Priority

### Must Fix Before Production:
1. ✅ Memory leak (setTimeout cleanup) - **CRITICAL**
2. ✅ Type assertion safety - **IMPORTANT**
3. ✅ Error type handling - **IMPORTANT**

### Should Fix Soon:
4. ✅ Date validation timezone - **MEDIUM**
5. ✅ parseInt validation - **MEDIUM**
6. ✅ Clear errors on step change - **LOW**

### Nice to Have:
7. ✅ Validation optimization - **LOW**
8. ✅ Accessibility improvements - **LOW**
9. ✅ Email verification error handling - **LOW**

---

## 🔧 Quick Fixes Summary

**Critical (Do Now):**
- Add `useRef` and cleanup for setTimeout
- Fix type assertion from `as any` to proper type
- Change `error: any` to `error: unknown`

**Important (Do Soon):**
- Fix date validation timezone handling
- Add validation for parseInt
- Clear errors on step navigation

**Optional (Polish):**
- Optimize validation (reduce trim calls)
- Add ARIA labels
- Improve email verification error handling

---

## Overall Assessment

**Code Quality:** 7/10
- Good structure and organization
- Some type safety issues
- Memory leak needs fixing

**Production Readiness:** 6/10
- Critical memory leak must be fixed
- Type safety issues should be addressed
- Otherwise functional

**Recommendation:** Fix critical issues before merging to main branch.

