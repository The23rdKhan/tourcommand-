# Testing Guide - Signup Flow Security Fixes

## Quick Test Checklist

### 🔴 Critical Security Tests

#### 1. Test Hardcoded Credentials Removal
**What to test:** Login should NOT work with empty fields

**Steps:**
1. Go to `http://localhost:3001/#/login`
2. Leave email and password fields empty
3. Click "Sign In"
4. **Expected:** Should show error "Email is required" or "Password is required"
5. **NOT Expected:** Should NOT automatically use demo credentials

**Status:** ✅ Pass / ❌ Fail

---

#### 2. Test Password Validation
**What to test:** Strong password requirements are enforced

**Test Cases:**
- [ ] Password with 7 characters → Should show "Password must be at least 8 characters"
- [ ] Password with 8 chars but no uppercase → Should show "Password must contain at least one uppercase letter"
- [ ] Password with 8 chars but no lowercase → Should show "Password must contain at least one lowercase letter"
- [ ] Password with 8 chars but no number → Should show "Password must contain at least one number"
- [ ] Password "Test1234" → Should pass validation ✅

**Steps:**
1. Go to `http://localhost:3001/#/signup`
2. Fill in First Name, Last Name, Email
3. Try each password scenario above
4. Check error messages

**Status:** ✅ Pass / ❌ Fail

---

#### 3. Test Name Field Validation
**What to test:** Both first and last name are required

**Test Cases:**
- [ ] Submit with empty first name → Should show "First name is required"
- [ ] Submit with empty last name → Should show "Last name is required"
- [ ] Submit with both names → Should proceed ✅

**Steps:**
1. Go to `http://localhost:3001/#/signup`
2. Leave first name empty, fill rest → Submit
3. Fill first name, leave last name empty → Submit
4. Fill both → Submit

**Status:** ✅ Pass / ❌ Fail

---

#### 4. Test Authentication Guards
**What to test:** Authenticated users can't access login/signup pages

**Steps:**
1. Log in to the app
2. Try to navigate to `http://localhost:3001/#/login`
3. Try to navigate to `http://localhost:3001/#/signup`
4. **Expected:** Should redirect to `/app/dashboard` or `/app/onboarding`
5. **NOT Expected:** Should NOT see login/signup forms

**Status:** ✅ Pass / ❌ Fail

---

#### 5. Test Onboarding Completion Check
**What to test:** Users with existing tours/venues can't re-access onboarding

**Steps:**
1. Complete onboarding (create a tour or venue)
2. Try to navigate to `http://localhost:3001/#/app/onboarding`
3. **Expected:** Should redirect to `/app/dashboard` with toast message
4. **NOT Expected:** Should NOT see onboarding form

**Status:** ✅ Pass / ❌ Fail

---

#### 6. Test Duplicate Email Handling
**What to test:** User-friendly error for duplicate emails

**Steps:**
1. Sign up with email: `test@example.com`
2. Try to sign up again with same email
3. **Expected:** Should show "An account with this email already exists. Please log in instead."
4. **NOT Expected:** Should NOT show technical error message

**Status:** ✅ Pass / ❌ Fail

---

#### 7. Test Profile Creation Error Handling
**What to test:** Graceful handling if profile creation fails

**Note:** This is hard to test without simulating a database error, but verify:
- Error messages are user-friendly
- No console errors appear
- User is not left in inconsistent state

**Status:** ✅ Pass / ❌ Fail

---

### 🟢 End-to-End Flow Test

#### Complete Signup Flow
**Steps:**
1. Go to `http://localhost:3001/#/signup`
2. Fill in:
   - First Name: "John"
   - Last Name: "Doe"
   - Email: `test-${Date.now()}@example.com` (unique email)
   - Password: "Test1234"
   - Confirm Password: "Test1234"
   - Check Terms checkbox
3. Click "Create Account"
4. **Expected:** Should redirect to `/app/onboarding`
5. Complete onboarding (select role, create tour/venue)
6. **Expected:** Should redirect to tour/venue detail page
7. Try to access `/app/onboarding` again
8. **Expected:** Should redirect to dashboard

**Status:** ✅ Pass / ❌ Fail

---

### 🟡 UI/UX Tests

#### Terms and Privacy Pages
- [ ] Click "Terms of Service" link in signup form → Should open Terms page
- [ ] Click "Privacy Policy" link in signup form → Should open Privacy page
- [ ] Click Terms link in footer → Should open Terms page
- [ ] Click Privacy link in footer → Should open Privacy page
- [ ] "Back to Sign Up" button works on both pages

**Status:** ✅ Pass / ❌ Fail

---

## Browser Console Checks

Open browser DevTools (F12) and check:

- [ ] **No red errors** in console
- [ ] **No warnings** about missing dependencies
- [ ] Network requests return **200 status** codes
- [ ] No authentication errors

---

## Quick Test Script

Run this sequence to test everything quickly:

```bash
1. Start dev server: npm run dev
2. Open: http://localhost:3001/#/signup
3. Test weak password → Should error
4. Test missing name → Should error
5. Complete signup with valid data
6. Complete onboarding
7. Try to access /login → Should redirect
8. Try to access /signup → Should redirect
9. Try to access /onboarding → Should redirect
10. Check Terms and Privacy pages load
```

---

## Issues Found

If you find any issues, note them here:

1. **Issue:** 
   - **Steps to reproduce:**
   - **Expected behavior:**
   - **Actual behavior:**
   - **Browser console errors:**

---

## Test Results Summary

- [ ] All critical security tests pass
- [ ] All validation tests pass
- [ ] Authentication guards work
- [ ] Onboarding completion check works
- [ ] Terms and Privacy pages work
- [ ] No console errors
- [ ] End-to-end flow works

**Overall Status:** ✅ Ready for Production / ⚠️ Issues Found / ❌ Not Ready

