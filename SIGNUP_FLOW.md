# Sign Up Flow - Complete User Journey

## Current Flow After Account Creation

### Step-by-Step Journey

1. **Sign Up Page** (`/signup`)
   - User enters: First Name, Last Name, Email, Password, Confirm Password
   - User checks: Terms of Service checkbox (required)
   - User clicks: "Create Account"
   - **Validation**: 
     - Passwords must match
     - Password must be at least 6 characters
     - Terms of Service must be accepted

2. **Account Created** ✅
   - Supabase creates `auth.users` record
   - User profile created in `user_profiles` table
   - **User is automatically logged in** (Supabase handles session)
   - Success message: "Account created! Redirecting to role selection..."

3. **Redirect to Role Selection** (`/app/onboarding`)
   - User is **already authenticated** (no need to sign in again)
   - Step 1: User selects their role:
     - 🎵 Artist / Musician
     - 🛡️ Artist Manager
     - 🏢 Venue Operator / Promoter
   - Step 2: Role-specific setup:
     - **Artist/Manager**: Create first tour
     - **Operator**: Create first venue

4. **After Onboarding**
   - **Artist/Manager**: Redirects to `/app/tours/{tourId}` (tour detail page)
   - **Operator**: Redirects to `/app/venues/{venueId}` (venue detail page)
   - User can now use the full app

---

## Important Notes

### Email Verification
- Supabase sends a verification email after signup
- **User can still use the app** without verifying (they're logged in)
- However, some features may require verified email (depends on Supabase settings)
- User should check email and verify when convenient

### No Marketing Screen
- After signup, users go **directly to role selection** (onboarding)
- There is **no marketing screen** in between
- Users are **already logged in**, so no sign-in step needed

### If User Logs Out Before Verifying
- If user logs out and tries to log back in before verifying email:
  - Supabase may require email verification first (depends on settings)
  - User should check email for verification link
  - After verifying, they can log in normally

---

## Flow Diagram

```
Sign Up Page
  ↓
[First Name, Last Name, Email, Password, Confirm Password, Terms Checkbox]
  ↓
Create Account Button
  ↓
Validation:
  - Passwords match? ✅
  - Password length >= 6? ✅
  - Terms accepted? ✅
  ↓
Supabase auth.signUp()
  ↓
Account Created + Auto-Logged In
  ↓
Redirect to /app/onboarding (Role Selection)
  ↓
Step 1: Select Role (Artist/Manager/Operator)
  ↓
Step 2: Create Tour (Artist/Manager) OR Create Venue (Operator)
  ↓
Redirect to Tour Detail OR Venue Detail
  ↓
User can now use full app
```

---

## What Changed

### Added to Signup Form:
1. ✅ **Password Confirmation Field**
   - User must enter password twice
   - Validation ensures passwords match

2. ✅ **Terms of Service Checkbox**
   - Required checkbox
   - Links to Terms of Service and Privacy Policy
   - User must accept to create account

3. ✅ **Enhanced Validation**
   - Password match validation
   - Terms acceptance validation
   - Clear error messages

### Flow Clarification:
- After signup → **Role Selection Page** (not marketing screen)
- User is **already logged in** (no sign-in step needed)
- Email verification happens in background (user can still use app)

---

## Testing Checklist

- [ ] Sign up with matching passwords → Should work
- [ ] Sign up with non-matching passwords → Should show error
- [ ] Sign up without accepting terms → Should show error
- [ ] Sign up successfully → Should redirect to `/app/onboarding`
- [ ] Verify user is logged in (can access protected routes)
- [ ] Complete onboarding → Should create tour/venue
- [ ] Check email for verification link (optional)

