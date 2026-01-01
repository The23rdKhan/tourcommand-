# Role Management Strategy

## Current State Analysis

### ✅ What Works
1. **Database Schema**: Role is stored as `TEXT` in `user_profiles` table - can be updated
2. **API Support**: `/api/auth/profile` endpoint supports role updates (PUT method)
3. **Context Function**: `updateUser()` in TourContext can update role
4. **Onboarding**: Role is set during onboarding and can be changed

### ⚠️ Current Limitation
- **Settings UI**: Role field is **DISABLED** (read-only) in Settings component
- Users cannot currently change their role after onboarding

---

## Best Approach: Allow Role Updates with Smart Handling

### Recommendation: **Enable Role Updates with Context-Aware Warnings**

#### Why Allow Role Changes?
1. **User Growth**: Artists become Managers, Managers add venues (Operators)
2. **Multi-Role Users**: Some users wear multiple hats
3. **Business Evolution**: Roles change as businesses grow
4. **Better UX**: Users shouldn't be locked into initial choice

#### Implementation Strategy

### Option 1: **Simple Role Update** (Recommended for MVP)
**Allow role changes with a warning modal**

```typescript
// In Settings.tsx
- Enable role dropdown (currently disabled)
- Show warning modal when role changes:
  "Changing your role will update your dashboard view. 
   Your existing data (tours/venues) will remain accessible."
- Update via updateUser() function
```

**Pros:**
- Simple to implement
- Flexible for users
- No data migration needed

**Cons:**
- Users might have data that doesn't match new role
- Dashboard might show irrelevant data

---

### Option 2: **Role Update with Data Migration** (Advanced)
**Allow role changes and migrate/archive data**

```typescript
// When changing from Artist → Operator:
- Archive existing tours (mark as inactive)
- Show message: "Your tours have been archived. 
   You can access them in Settings > Archived Tours"
- Redirect to venue creation flow

// When changing from Operator → Artist:
- Archive venues
- Redirect to tour creation flow
```

**Pros:**
- Clean separation of role-specific data
- Better UX for each role
- Prevents confusion

**Cons:**
- More complex implementation
- Requires data migration logic
- Users might lose access to data temporarily

---

### Option 3: **Multi-Role Support** (Future Enhancement)
**Allow users to have multiple roles simultaneously**

```typescript
// Database schema change:
user_profiles.roles = ['Artist', 'Manager'] // Array instead of single role
- User can switch between roles via dropdown
- Dashboard adapts to selected role
- All data accessible regardless of active role
```

**Pros:**
- Most flexible
- Supports real-world use cases
- No data loss

**Cons:**
- Requires schema migration
- More complex UI/UX
- Harder to implement

---

## Recommended Implementation Plan

### Phase 1: Enable Role Updates (Quick Win)
1. **Update Settings Component**
   - Change role field from disabled input to dropdown
   - Add warning modal before role change
   - Call `updateUser()` on save

2. **Add Warning Modal**
   ```tsx
   "Changing your role will update your dashboard experience.
    Your existing data will remain accessible but may be filtered
    based on your new role. You can change this again anytime."
   ```

3. **Update Dashboard Logic**
   - Dashboard already adapts to role (check `user.role`)
   - No changes needed if dashboard is role-aware

### Phase 2: Smart Data Handling (If Needed)
1. **Add Role Change Handler**
   - Check if user has data incompatible with new role
   - Show migration options
   - Archive or hide irrelevant data

### Phase 3: Multi-Role Support (Future)
1. **Schema Migration**
   - Change `role` to `roles` (array)
   - Update all queries
   - Add role switcher UI

---

## Code Changes Needed

### 1. Update Settings Component

```tsx
// components/Settings.tsx

// Change from:
<input type="text" disabled defaultValue={user?.role} />

// To:
<select 
  value={user?.role} 
  onChange={(e) => setSelectedRole(e.target.value)}
  className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white"
>
  <option value="Artist">Artist / Musician</option>
  <option value="Manager">Artist Manager</option>
  <option value="Operator">Venue Operator</option>
</select>

// Add warning modal before save
{showRoleWarning && (
  <RoleChangeWarning 
    oldRole={user?.role}
    newRole={selectedRole}
    onConfirm={handleRoleChange}
    onCancel={() => setShowRoleWarning(false)}
  />
)}
```

### 2. Add Role Change Handler

```tsx
const handleRoleChange = async () => {
  try {
    await updateUser({ role: selectedRole });
    addToast('Role updated successfully', 'success');
    // Optionally: Refresh dashboard or redirect
  } catch (error) {
    addToast('Failed to update role', 'error');
  }
};
```

### 3. Update API (Already Supports It)
- ✅ `/api/auth/profile` already supports role updates
- ✅ Validation schema allows role changes
- ✅ Database allows role updates

---

## User Experience Flow

### Current Flow (Role Locked)
```
Sign Up → Onboarding → Select Role → Role is LOCKED
```

### Recommended Flow (Role Flexible)
```
Sign Up → Onboarding → Select Role → Can Change in Settings Anytime
                                    ↓
                          Warning Modal → Confirm → Role Updated
                                    ↓
                          Dashboard Refreshes with New Role View
```

---

## Considerations

### Data Compatibility
- **Artist/Manager**: Have tours, shows, vendors
- **Operator**: Have venues
- **Question**: Should Operators see tours? Should Artists see venues?

### Dashboard Adaptation
- Dashboard should filter/prioritize based on role
- Check if current dashboard implementation is role-aware

### Business Logic
- Some features might be role-specific
- Upsell messages are already role-aware (good!)
- Tour creation vs Venue creation logic

---

## Recommendation Summary

**For MVP/Current State:**
✅ **Enable role updates in Settings with a simple warning modal**

**Why:**
1. Low effort, high value
2. Users can adapt as they grow
3. No breaking changes to existing data
4. Dashboard already supports role-based views

**Implementation:**
- 1-2 hours of work
- Enable dropdown in Settings
- Add warning modal
- Test role switching

**Future Enhancements:**
- Add data migration for incompatible role changes
- Consider multi-role support
- Add role-specific onboarding flows

---

## Testing Checklist

- [ ] User can change role in Settings
- [ ] Warning modal appears before role change
- [ ] Role updates in database
- [ ] Dashboard refreshes with new role view
- [ ] Existing data remains accessible
- [ ] Role-specific features work correctly
- [ ] Can change role multiple times
- [ ] Role persists after logout/login

