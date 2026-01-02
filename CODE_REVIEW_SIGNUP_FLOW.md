# Code Review: Signup Flow

## Overview
This document reviews the signup and onboarding flow for security, error handling, user experience, and code quality issues.

---

## 🔴 Critical Issues

### 1. **Hardcoded Demo Credentials in Login** (Security Risk)
**Location:** `components/Auth.tsx:22-23`

```typescript
const { data, error: authError } = await supabase.auth.signInWithPassword({
  email: email || 'manager@band.com',
  password: password || 'demo123'
});
```

**Issue:** Default credentials in production code is a major security vulnerability.

**Fix:**
```typescript
const { data, error: authError } = await supabase.auth.signInWithPassword({
  email: email,
  password: password
});

if (!email || !password) {
  setError('Email and password are required');
  setLoading(false);
  return;
}
```

**Priority:** 🔴 **CRITICAL** - Must fix before production

---

### 2. **No Error Handling for Profile Creation Failure**
**Location:** `components/Auth.tsx:177-187`

**Issue:** If `user_profiles.insert()` fails after `auth.signUp()` succeeds, user is left in inconsistent state (auth user exists but no profile).

**Current Code:**
```typescript
if (data.user) {
    // Create user profile
    await supabase
        .from('user_profiles')
        .insert({...});
    // No error handling here!
    navigate('/app/onboarding');
}
```

**Fix:**
```typescript
if (data.user) {
    const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
            id: data.user.id,
            name: fullName,
            email: email,
            role: 'Manager',
            tier: 'Free'
        });

    if (profileError) {
        // Log error and attempt cleanup
        console.error('Failed to create profile:', profileError);
        // Optionally: Delete auth user or show error
        setError('Account created but profile setup failed. Please contact support.');
        addToast('Profile creation failed. Please try logging in.', 'error');
        return;
    }

    addToast('Account created! Redirecting to role selection...', 'success');
    navigate('/app/onboarding');
}
```

**Priority:** 🔴 **CRITICAL** - Data integrity issue

---

### 3. **No Protection Against Already-Authenticated Users**
**Location:** `components/Auth.tsx` (Signup & Login components)

**Issue:** Authenticated users can still access `/signup` and `/login` pages, which is confusing.

**Fix:** Add redirect check:
```typescript
export const Signup: React.FC = () => {
    const { isAuthenticated, loading } = useTour();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && isAuthenticated) {
            // Check if user has completed onboarding
            navigate('/app/dashboard');
        }
    }, [isAuthenticated, loading, navigate]);

    if (loading) return <div>Loading...</div>;
    if (isAuthenticated) return null; // Will redirect

    // ... rest of component
};
```

**Priority:** 🟡 **HIGH** - UX issue

---

### 4. **Weak Password Validation**
**Location:** `components/Auth.tsx:147-151`

**Issue:** Only checks minimum length (6 characters). No complexity requirements.

**Current:**
```typescript
if (password.length < 6) {
    setError('Password must be at least 6 characters');
    setLoading(false);
    return;
}
```

**Fix:**
```typescript
const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
        return 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(password)) {
        return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
        return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
        return 'Password must contain at least one number';
    }
    return null;
};

// In handleSignup:
const passwordError = validatePassword(password);
if (passwordError) {
    setError(passwordError);
    setLoading(false);
    return;
}
```

**Priority:** 🟡 **HIGH** - Security best practice

---

## 🟡 High Priority Issues

### 5. **Inconsistent Role Assignment**
**Location:** `components/Auth.tsx:185` and `components/Onboarding.tsx:130`

**Issue:** Signup creates profile with `role: 'Manager'`, but onboarding allows user to select any role. This creates a temporary inconsistency.

**Current Flow:**
1. Signup → Creates profile with `role: 'Manager'`
2. Onboarding → User selects different role → Updates to selected role

**Impact:** User profile has wrong role until onboarding completes.

**Fix Options:**
- Option A: Don't set role in signup, set it in onboarding only
- Option B: Set a default role like 'Pending' and require onboarding completion

**Recommended Fix:**
```typescript
// In signup, don't set role:
await supabase
    .from('user_profiles')
    .insert({
        id: data.user.id,
        name: fullName,
        email: email,
        role: null, // or 'Pending'
        tier: 'Free'
    });
```

**Priority:** 🟡 **HIGH** - Data consistency

---

### 6. **No Check for Already-Completed Onboarding**
**Location:** `components/Onboarding.tsx`

**Issue:** Users who already have tours/venues can still access onboarding page.

**Fix:**
```typescript
const Onboarding: React.FC = () => {
  const { user, tours, venues } = useTour();
  const navigate = useNavigate();

  useEffect(() => {
    // If user already has tours or venues, they've completed onboarding
    if (user && (tours.length > 0 || venues.length > 0)) {
      navigate('/app/dashboard');
    }
  }, [user, tours, venues, navigate]);

  // ... rest of component
};
```

**Priority:** 🟡 **HIGH** - UX issue

---

### 7. **Unsafe Type Assertions**
**Location:** `components/Auth.tsx:52, 194`

**Issue:** Using `any` type reduces type safety.

**Current:**
```typescript
} catch (err: any) {
    setError(err.message || 'Failed to log in');
}
```

**Fix:**
```typescript
} catch (err: unknown) {
    const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to log in';
    setError(errorMessage);
    addToast(errorMessage, 'error');
}
```

**Priority:** 🟡 **MEDIUM** - Code quality

---

### 8. **No Input Sanitization**
**Location:** `components/Auth.tsx` (all input fields)

**Issue:** User input is not sanitized before database insertion.

**Risk:** Potential XSS or injection attacks (though Supabase handles SQL injection).

**Fix:** Add basic sanitization:
```typescript
const sanitizeInput = (input: string): string => {
    return input.trim().replace(/[<>]/g, ''); // Remove potential HTML tags
};

// Use in form:
onChange={(e) => setFirstName(sanitizeInput(e.target.value))}
```

**Priority:** 🟡 **MEDIUM** - Security best practice

---

### 9. **Empty Name Handling**
**Location:** `components/Auth.tsx:160`

**Issue:** If both firstName and lastName are empty after trim, falls back to email prefix, which might not be ideal.

**Current:**
```typescript
const fullName = `${firstName.trim()} ${lastName.trim()}`.trim() || email.split('@')[0];
```

**Fix:** Add validation:
```typescript
const firstNameTrimmed = firstName.trim();
const lastNameTrimmed = lastName.trim();

if (!firstNameTrimmed || !lastNameTrimmed) {
    setError('First name and last name are required');
    setLoading(false);
    return;
}

const fullName = `${firstNameTrimmed} ${lastNameTrimmed}`;
```

**Priority:** 🟡 **MEDIUM** - Data quality

---

## 🟢 Medium Priority Issues

### 10. **No Rate Limiting**
**Location:** `components/Auth.tsx` (both Login and Signup)

**Issue:** No protection against brute force attacks or spam signups.

**Fix:** Implement client-side rate limiting or rely on Supabase's built-in rate limiting (should be configured in Supabase dashboard).

**Priority:** 🟢 **MEDIUM** - Security enhancement

---

### 11. **No Email Format Validation Beyond HTML5**
**Location:** `components/Auth.tsx:246`

**Issue:** Only relies on `type="email"` HTML5 validation.

**Fix:** Add regex validation:
```typescript
const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// In handleSignup:
if (!isValidEmail(email)) {
    setError('Please enter a valid email address');
    setLoading(false);
    return;
}
```

**Priority:** 🟢 **LOW** - HTML5 validation is usually sufficient

---

### 12. **No Loading State During Profile Creation**
**Location:** `components/Auth.tsx:177-187`

**Issue:** User doesn't see feedback during profile creation step.

**Current:** Button shows loading, but no indication of what's happening.

**Fix:** Add more descriptive loading message or progress indicator.

**Priority:** 🟢 **LOW** - UX enhancement

---

### 13. **Onboarding Form State Not Preserved**
**Location:** `components/Onboarding.tsx`

**Issue:** If user navigates away from onboarding, form data is lost.

**Fix:** Store form state in localStorage or sessionStorage:
```typescript
// Save to localStorage on change
useEffect(() => {
    localStorage.setItem('onboarding_profile', JSON.stringify(profile));
    localStorage.setItem('onboarding_tourData', JSON.stringify(tourData));
    localStorage.setItem('onboarding_venueData', JSON.stringify(venueData));
}, [profile, tourData, venueData]);

// Load from localStorage on mount
useEffect(() => {
    const savedProfile = localStorage.getItem('onboarding_profile');
    if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
    }
    // ... similar for tourData and venueData
}, []);
```

**Priority:** 🟢 **LOW** - Nice-to-have UX feature

---

### 14. **No Duplicate Email Handling**
**Location:** `components/Auth.tsx:163-175`

**Issue:** Error message for duplicate email might not be user-friendly.

**Fix:** Check error code and provide better message:
```typescript
if (authError) {
    if (authError.message.includes('already registered') || authError.code === 'user_already_exists') {
        setError('An account with this email already exists. Please log in instead.');
    } else {
        setError(authError.message || 'Failed to create account');
    }
    throw authError;
}
```

**Priority:** 🟢 **LOW** - UX improvement

---

## ✅ Good Practices Found

1. ✅ **Password confirmation validation** - Properly implemented
2. ✅ **Terms of Service checkbox** - Required and validated
3. ✅ **Error state management** - Errors are displayed to user
4. ✅ **Loading states** - Buttons show loading indicators
5. ✅ **Toast notifications** - Good user feedback
6. ✅ **Form validation** - Client-side validation before submission
7. ✅ **Memory leak prevention** - Timeout cleanup in Onboarding
8. ✅ **Type safety in Onboarding** - Proper error handling with `unknown`

---

## 📋 Recommended Action Items

### Before Production:
1. 🔴 Remove hardcoded demo credentials
2. 🔴 Add error handling for profile creation failure
3. 🔴 Add authentication check to prevent authenticated users from accessing signup/login
4. 🟡 Strengthen password validation
5. 🟡 Fix role assignment inconsistency
6. 🟡 Add onboarding completion check

### Nice to Have:
7. 🟢 Add input sanitization
8. 🟢 Improve error messages for duplicate emails
9. 🟢 Preserve onboarding form state
10. 🟢 Add rate limiting (if not handled by Supabase)

---

## Summary

**Critical Issues:** 3  
**High Priority:** 6  
**Medium Priority:** 5  
**Good Practices:** 8

**Overall Assessment:** The signup flow is functional but has several security and data integrity issues that should be addressed before production deployment. The code quality is generally good, but error handling and edge cases need improvement.

