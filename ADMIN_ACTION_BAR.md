# Admin Company View - Action Bar Documentation

## Overview
The Admin Company View now includes a comprehensive action bar at the bottom of the page for managing company verification and badges.

## Features

### 1. Delete Company
- **Button**: Red "Delete Company" button with trash icon
- **Action**: Deletes the entire company record
- **Safety**: Includes confirmation dialog before deletion
- **Navigation**: Redirects to `/admin/companies` after successful deletion

### 2. Primary Verification Status
Admins can set the company verification status to:

#### Verification Statuses:
- **VERIFIED** (Green button with checkmark)
  - Company has passed all verification requirements
  - Shows green badge in company header
  
- **REJECTED** (Red button with X icon)
  - Company verification has been rejected
  - Shows red badge in company header
  
- **PENDING** (Yellow button)
  - Company verification is under review
  - Shows yellow badge in company header

#### Verification Message:
- Click "Add Message" to show/hide textarea
- Add a message to inform the company about:
  - Missing requirements
  - Verification status explanation
  - Next steps needed
- Message is saved with the verification status
- Displayed to the company in their dashboard

### 3. Verification Badges
Three-tier badge system for progressive verification:

#### Bronze Badge (Orange)
- **Requirement**: Automated RDB/TIN upload during registration
- **Database Field**: `isBronzeVerified`
- **UI**: Orange "Bronze" badge with medal icon
- **Tooltip**: "Bronze: RDB/TIN uploaded"
- **Purpose**: Basic business legitimacy verification

#### Silver Badge (Blue)
- **Requirement**: Professional License (IER/RIA) and Portfolio upload (3 images)
- **Database Field**: `isSilverVerified`
- **UI**: Blue "Verified" badge with medal icon
- **Tooltip**: "Silver: Professional License & Portfolio"
- **Benefits**: 
  - Professional verification mark
  - Priority in search results
  - Enhanced company credibility

#### Gold Badge (Yellow/Gold)
- **Requirement**: Insurance, Audited Financials, and CRB Reports
- **Database Field**: `isGoldVerified`
- **UI**: Gold badge with medal icon
- **Tooltip**: "Gold: Insurance, Financials & CRB Reports"
- **Benefits**:
  - Highest level of verification
  - "Consnect Certified" status
  - Activates "Request Financing" button
  - Maximum trust indicator

### 4. Current Badge Status Display
At the bottom of the action bar:
- Shows all three badges with checkmarks (✓) or crosses (✗)
- Color-coded:
  - Earned badges: Full color (orange/blue/yellow)
  - Not earned: Gray with light background
- Real-time updates after badge changes

## User Interface

### Layout
- **Position**: Sticky bottom bar (fixed at bottom, follows scroll)
- **Background**: White with shadow and border
- **Sections**: 
  1. Delete button (far left)
  2. Primary verification controls (center-left)
  3. Badge controls (center-right)
  4. Current status display (bottom)

### Visual States
- **Loading**: Spinner icon replaces button icon during operations
- **Disabled**: Buttons become semi-transparent when operation in progress
- **Active Badges**: Full color background with white text
- **Inactive Badges**: Gray background with dark text
- **Hover Effects**: Darker shade on hover for all buttons

## Technical Implementation

### Server Actions Used
1. **`deleteCompany(id)`** - From `/src/server/company/company.ts`
   - Deletes company and all related data
   
2. **`updateCompanyVerificationStatus(companyId, status, message?)`** - From `/src/server/company/verification.ts`
   - Updates verification status (PENDING/VERIFIED/REJECTED)
   - Optionally sets message for company
   
3. **`updateCompanyVerificationBadge(companyId, badgeType, value)`** - From `/src/server/company/verification.ts`
   - Toggles badge status (bronze/silver/gold)
   - Creates verification record if doesn't exist

### State Management
- **`isDeleting`**: Loading state for delete operation
- **`isUpdatingStatus`**: Loading state for verification status
- **`isUpdatingBadge`**: Tracks which badge is being updated
- **`verificationMessage`**: Controlled input for admin message
- **`showMessageInput`**: Toggle for message textarea visibility

### Database Schema
The `CompanyVerification` model includes:
```prisma
model CompanyVerification {
  id                String         @id @default(uuid())
  status            ECompanyStatus
  message           String
  isBronzeVerified  Boolean        @default(false)
  isSilverVerified  Boolean        @default(false)
  isGoldVerified    Boolean        @default(false)
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  companyId         String         @unique
  company           Company        @relation(fields: [companyId], references: [id])
}
```

## Usage Flow

### Verifying a Company:
1. Review all company information sections (collapsible)
2. Check legal documents in "Legal Documents" section
3. Click "Add Message" if you want to provide feedback
4. Enter verification message explaining status or requirements
5. Click appropriate verification button (Verify/Reject/Set Pending)
6. Message is sent to company with status update

### Awarding Badges:
1. Review company's uploaded documents
2. Verify requirements are met for specific badge level:
   - **Bronze**: Check RDB/TIN documents
   - **Silver**: Verify professional license and portfolio
   - **Gold**: Review insurance, financials, CRB reports
3. Click the badge button to toggle it on/off
4. Badge status updates immediately
5. Company sees new badge on their profile

### Deleting a Company:
1. Click "Delete Company" button
2. Confirm deletion in dialog
3. Company and all related data is permanently removed
4. Redirected to companies list

## Best Practices

1. **Always add a message** when rejecting a company to explain why
2. **Award badges progressively** - Bronze → Silver → Gold
3. **Review documents thoroughly** before awarding Gold badge
4. **Use "Set Pending"** when company needs to update information
5. **Double-check before deletion** - action cannot be undone

## Toast Notifications
The system provides feedback for all actions:
- ✅ Success: "Company verified successfully"
- ✅ Success: "Bronze badge awarded"
- ❌ Error: "Failed to update verification status"
- ✅ Success: "Company deleted successfully"

All operations trigger page refresh to show updated data.
