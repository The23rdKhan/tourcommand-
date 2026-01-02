# UI & Backend Alignment Review

## Executive Summary

✅ **Overall Status: Well Aligned** - The frontend and backend are properly connected with consistent data transformations and API contracts.

### Key Findings:
- ✅ API endpoints match frontend calls
- ✅ Data transformation (camelCase ↔ snake_case) is consistent
- ✅ Authentication flow is aligned
- ✅ Error handling is consistent
- ⚠️ One minor issue found (see below)

---

## 1. API Endpoint Mapping

### ✅ Tours
| Frontend Call | Backend Endpoint | Status |
|--------------|------------------|--------|
| `apiCall('tours')` GET | `GET /api/tours` | ✅ Match |
| `apiCall('tours')` POST | `POST /api/tours` | ✅ Match |
| `apiCall('tours/{id}')` PUT | `PUT /api/tours/[id]` | ✅ Match |
| `apiCall('tours/{id}')` DELETE | `DELETE /api/tours/[id]` | ✅ Match |

**Data Flow:**
- Frontend sends: `camelCase` (startDate, endDate, tourManager, bookingAgent)
- Backend expects: `camelCase` (validated by Zod schema)
- Backend stores: `snake_case` (start_date, end_date, tour_manager, booking_agent)
- Backend returns: `snake_case`
- Frontend transforms: `transformTour()` converts to `camelCase`

### ✅ Shows
| Frontend Call | Backend Endpoint | Status |
|--------------|------------------|--------|
| `apiCall('shows')` POST | `POST /api/shows` | ✅ Match |
| `apiCall('shows/{id}')` PUT | `PUT /api/shows/[id]` | ✅ Match |
| `apiCall('shows/{id}')` DELETE | `DELETE /api/shows/[id]` | ✅ Match |

**Data Flow:**
- Frontend sends: `camelCase` (tourId, dealType, venueId)
- Backend expects: `camelCase` (validated by Zod)
- Backend stores: `snake_case` (tour_id, deal_type, venue_id)
- Backend returns: `snake_case`
- Frontend transforms: `transformShow()` converts to `camelCase`

**Note:** Shows are loaded via direct Supabase query in `refreshData()`, not through API endpoint. This is fine.

### ✅ Venues
| Frontend Call | Backend Endpoint | Status |
|--------------|------------------|--------|
| `apiCall('venues')` POST | `POST /api/venues` | ✅ Match |
| `apiCall('venues/{id}')` PUT | `PUT /api/venues/[id]` | ✅ Match |

**Data Flow:**
- Frontend sends: `camelCase` (contactName, contactEmail)
- Backend expects: `camelCase` (validated by Zod)
- Backend stores: `snake_case` (contact_name, contact_email)
- Backend returns: `snake_case`
- Frontend transforms: `transformVenue()` converts to `camelCase`

### ✅ Vendors
| Frontend Call | Backend Endpoint | Status |
|--------------|------------------|--------|
| `apiCall('vendors')` POST | `POST /api/vendors` | ✅ Match |
| `apiCall('vendors/{id}')` DELETE | `DELETE /api/vendors/[id]` | ✅ Match |

**Data Flow:**
- Frontend sends: `camelCase` (pocName, pocEmail, pocPhone, requiresPermits)
- Backend expects: `camelCase` (validated by Zod)
- Backend stores: `snake_case` (poc_name, poc_email, poc_phone, requires_permits)
- Backend returns: `snake_case`
- Frontend transforms: `transformVendor()` converts to `camelCase`

### ✅ Authentication
| Frontend Call | Backend Endpoint | Status |
|--------------|------------------|--------|
| `apiCall('auth/profile')` PUT | `PUT /api/auth/profile` | ✅ Match |
| `apiCall('auth/subscription')` PUT | `PUT /api/auth/subscription` | ✅ Match |

**Data Flow:**
- Frontend sends: `camelCase` (name, email, role, tier)
- Backend expects: `camelCase` (validated by Zod)
- Backend stores: `snake_case` (same in this case - no transformation needed)
- Backend returns: `snake_case`
- Frontend uses: Directly (no transformation needed)

---

## 2. Data Transformation Functions

### ✅ Transform Functions (Frontend)
Located in `context/TourContext.tsx`:

1. **`transformTour(row)`** - Lines 36-49
   - Converts: `start_date` → `startDate`, `end_date` → `endDate`, etc.
   - ✅ Correctly handles all fields

2. **`transformShow(row)`** - Lines 51-66
   - Converts: `tour_id` → `tourId`, `deal_type` → `dealType`, `venue_id` → `venueId`
   - ✅ Correctly handles all fields including JSONB (financials, logistics, travel)

3. **`transformVenue(row)`** - Lines 68-78
   - Converts: `contact_name` → `contactName`, `contact_email` → `contactEmail`
   - ✅ Correctly handles optional fields with `|| undefined`

4. **`transformVendor(row)`** - Lines 80-92
   - Converts: `poc_name` → `pocName`, `poc_email` → `pocEmail`, etc.
   - ✅ Correctly handles optional fields

---

## 3. Request/Response Format

### ✅ Response Wrapper
- **Backend**:** Uses `sendResponse()` which wraps in `{ success: true, data: ... }`
- **Frontend**:** Uses `apiCall()` which extracts `result.data`
- ✅ **Aligned correctly**

### ✅ Error Format
- **Backend**: Returns `{ success: false, error: { message: ... } }`
- **Frontend**: Extracts `error.error?.message || 'API request failed'`
- ✅ **Aligned correctly**

---

## 4. Authentication Flow

### ✅ Token Handling
- **Frontend**: Gets session token via `supabase.auth.getSession()`
- **Frontend**: Sends in `Authorization: Bearer {token}` header
- **Backend**: Validates via `authenticateRequest()` → `supabase.auth.getUser(token)`
- ✅ **Aligned correctly**

### ✅ User ID Extraction
- **Backend**: Extracts `userId` from validated token
- **Backend**: Uses `userId` for all queries (RLS also enforces)
- ✅ **Aligned correctly**

---

## 5. Field Name Consistency

### ✅ Request Payloads (Frontend → Backend)

**Tours:**
- ✅ `startDate` → Backend expects `startDate` (Zod) → Stores as `start_date`
- ✅ `endDate` → Backend expects `endDate` (Zod) → Stores as `end_date`
- ✅ `tourManager` → Backend expects `tourManager` (Zod) → Stores as `tour_manager`
- ✅ `bookingAgent` → Backend expects `bookingAgent` (Zod) → Stores as `booking_agent`

**Shows:**
- ✅ `tourId` → Backend expects `tourId` (Zod) → Stores as `tour_id`
- ✅ `dealType` → Backend expects `dealType` (Zod) → Stores as `deal_type`
- ✅ `venueId` → Backend expects `venueId` (Zod) → Stores as `venue_id`

**Venues:**
- ✅ `contactName` → Backend expects `contactName` (Zod) → Stores as `contact_name`
- ✅ `contactEmail` → Backend expects `contactEmail` (Zod) → Stores as `contact_email`

**Vendors:**
- ✅ `pocName` → Backend expects `pocName` (Zod) → Stores as `poc_name`
- ✅ `pocEmail` → Backend expects `pocEmail` (Zod) → Stores as `poc_email`
- ✅ `pocPhone` → Backend expects `pocPhone` (Zod) → Stores as `poc_phone`
- ✅ `requiresPermits` → Backend expects `requiresPermits` (Zod) → Stores as `requires_permits`

---

## 6. Validation Alignment

### ✅ Zod Schemas
All API endpoints use Zod schemas from `lib/validations.ts`:
- ✅ `TourSchema` - Matches frontend Tour type
- ✅ `ShowSchema` - Matches frontend Show type
- ✅ `VenueSchema` - Matches frontend Venue type
- ✅ `VendorSchema` - Matches frontend Vendor type
- ✅ `UserProfileSchema` - Matches frontend UserProfile type

**All schemas use camelCase** which matches frontend expectations.

---

## 7. Issues Found

### ⚠️ Minor Issue: Show API Endpoint Query Parameter

**Location:** `api/shows/index.ts` line 9

**Issue:**
- Backend expects `tourId` as query parameter for GET requests (line 9, 12)
- Frontend doesn't call GET `/api/shows?tourId=...` - instead loads shows via direct Supabase query in `refreshData()`

**Impact:** 
- **Low** - Frontend doesn't use this endpoint for GET
- GET endpoint exists but is unused

**Recommendation:**
- Either remove unused GET endpoint, OR
- Update frontend to use it (but current approach is fine)

**Status:** Not critical - current implementation works correctly

---

## 8. Data Loading Strategy

### ✅ Current Approach
- **Tours, Venues, Vendors**: Loaded via direct Supabase queries in `refreshData()`
- **Shows**: Loaded per-tour via direct Supabase query
- **CRUD Operations**: Use API endpoints

**Why this works:**
- Direct queries are faster (no serverless function overhead)
- RLS policies enforce security
- Transform functions handle data conversion
- ✅ **This is a valid approach**

---

## 9. Error Handling Alignment

### ✅ Error Types
- **Backend**: Uses custom error classes (`AuthenticationError`, `AuthorizationError`, `NotFoundError`, `ValidationError`, `SubscriptionError`)
- **Frontend**: Catches generic `Error` and extracts message
- ✅ **Aligned** - Frontend displays user-friendly messages

### ✅ HTTP Status Codes
- **401**: Authentication errors
- **403**: Authorization errors
- **400**: Validation errors
- **404**: Not found errors
- **500**: Server errors
- ✅ **Aligned correctly**

---

## 10. Response Status Codes

### ✅ Success Codes
- **200**: GET, PUT (default)
- **201**: POST (created)
- ✅ **Aligned correctly**

---

## 11. Optional Fields Handling

### ✅ Null vs Undefined
- **Database**: Stores `NULL` for optional fields
- **Backend**: Returns `null` or omits field
- **Frontend**: Transforms `null` → `undefined` using `|| undefined`
- ✅ **Aligned correctly**

**Example:**
```typescript
// transformVenue
contactName: row.contact_name || undefined  // null → undefined
```

---

## 12. JSONB Fields

### ✅ Complex Data Types
- **Shows.financials**: JSONB in DB, object in frontend
- **Shows.logistics**: JSONB in DB, object in frontend (optional)
- **Shows.travel**: JSONB in DB, array in frontend (optional)
- ✅ **Aligned correctly** - No transformation needed, stored as-is

---

## 13. ID Generation

### ✅ ID Formats
- **Tours**: `t-{timestamp}` (backend generates)
- **Shows**: `s-{timestamp}` (backend generates if not provided)
- **Venues**: `v-{timestamp}` (backend generates if not provided)
- **Vendors**: `vdr-{timestamp}` (backend generates if not provided)
- ✅ **Aligned correctly**

---

## 14. Subscription Tier Checks

### ✅ Tier Enforcement
- **Frontend**: Checks tier limits in components (e.g., TourManager)
- **Backend**: Also checks tier limits in API (e.g., `api/tours/index.ts` line 40)
- ✅ **Double-checked for security** - Good practice!

---

## Summary

### ✅ What's Working Well
1. **API Contracts**: All endpoints match frontend calls
2. **Data Transformation**: Consistent camelCase ↔ snake_case conversion
3. **Authentication**: Properly aligned
4. **Error Handling**: Consistent format
5. **Validation**: Zod schemas match TypeScript types
6. **Optional Fields**: Properly handled (null → undefined)

### ⚠️ Minor Issues
1. **Unused GET endpoint**: `/api/shows` GET expects `tourId` query param but is never called
   - **Impact**: None (frontend uses direct Supabase query)
   - **Action**: Can be ignored or removed

### ✅ Recommendations
1. **No critical issues found** - System is well-aligned
2. Consider removing unused GET `/api/shows` endpoint if not needed
3. Current architecture is sound and production-ready

---

## Testing Checklist

To verify alignment, test:
- [ ] Create tour → Verify data saves correctly
- [ ] Update tour → Verify changes persist
- [ ] Create show → Verify tourId is sent correctly
- [ ] Update show → Verify all fields save
- [ ] Create venue → Verify optional fields work
- [ ] Update role in Settings → Verify role updates
- [ ] Check browser console for API errors
- [ ] Verify data persists after refresh

---

## Conclusion

**Status: ✅ PRODUCTION READY**

The UI and backend are properly aligned. All API contracts match, data transformations are consistent, and error handling is unified. The one minor issue (unused GET endpoint) doesn't affect functionality.

**Confidence Level: High** - Ready for testing and deployment.

