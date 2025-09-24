# Onboarding API Integration Guide

## Overview
This guide explains how the onboarding system has been integrated with the comprehensive API endpoints you provided. The system now properly handles all 9 onboarding steps with their specific data structures.

## Components Updated

### 1. OnboardingProgressDisplay.tsx
**Location**: `src/components/OnboardingProgressDisplay.tsx`

**Key Updates**:
- ✅ Fixed import path to use `.js` file instead of `.ts`
- ✅ Updated step titles to match API documentation
- ✅ Enhanced TypeScript interfaces to match API response structure
- ✅ Added step data display functionality
- ✅ Improved error handling with specific error messages
- ✅ Enhanced loading states and user feedback

**Features**:
- Displays actual step data (height, blood group, allergies, etc.)
- Shows completion dates for each step
- Handles API errors gracefully
- Supports both full and compact display modes
- Real-time progress percentage calculation

### 2. OnboardingTestComponent.tsx
**Location**: `src/components/OnboardingTestComponent.tsx`

**Purpose**: Test component to verify API integration
- Tests all API endpoints
- Shows real-time results
- Displays both full and compact progress views
- Helps debug integration issues

## API Integration Details

### Base Configuration
- **API URL**: `https://empolyee-backedn.onrender.com/api`
- **Base Route**: `/api/onboarding`
- **Authentication**: Bearer token from localStorage

### Supported Endpoints

#### 1. Health Check
```javascript
GET /api/onboarding/health
```
- Tests if onboarding routes are working
- Used by test component for connectivity verification

#### 2. Get Progress
```javascript
GET /api/onboarding/progress/:userId
```
- Retrieves complete onboarding progress
- Returns step data, completion status, and progress percentage

#### 3. Store Single Step
```javascript
POST /api/onboarding/store
```
- Stores individual onboarding step
- Used for step-by-step data collection

#### 4. Store Multiple Steps
```javascript
POST /api/onboarding/store-multiple
```
- Bulk storage of multiple steps
- Efficient for batch operations

#### 5. Get Specific Step
```javascript
GET /api/onboarding/step/:userId/:step
```
- Retrieves data for a specific step
- Useful for editing or reviewing individual steps

#### 6. Delete Step
```javascript
DELETE /api/onboarding/step/:userId/:step
```
- Removes a specific onboarding step
- Allows users to redo steps

## Step Data Structure

### Step 1: Height Information
```json
{
  "step": 1,
  "height": "175",
  "unit": "cm"
}
```

### Step 2: Emergency Contact
```json
{
  "step": 2,
  "emergency_contact_relation": "Spouse",
  "emergency_contact_name": "John Doe",
  "emergency_contact": "+1234567890"
}
```

### Step 3: Blood Group
```json
{
  "step": 3,
  "blood_group": "O+"
}
```

### Step 4: Custom Step
```json
{
  "step": 4,
  "data": {
    "custom_field": "custom_value"
  }
}
```

### Step 5: Provider Information
```json
{
  "step": 5,
  "provider": "General Hospital",
  "success": true,
  "skipped": false
}
```

### Step 6: Allergies
```json
{
  "step": 6,
  "allergies": ["Peanuts", "Shellfish"],
  "allergy_description": "Severe allergic reactions"
}
```

### Step 7: Medical Disorders
```json
{
  "step": 7,
  "disorders": ["Diabetes", "Hypertension"],
  "disorder_detail": "Type 2 diabetes managed with medication"
}
```

### Step 8: Avatar
```json
{
  "step": 8,
  "avatar": "/uploads/avatar/user123.jpg"
}
```

### Step 9: Completion
```json
{
  "step": 9,
  "completed": true
}
```

## Usage Examples

### 1. Display Onboarding Progress
```tsx
import OnboardingProgressDisplay from './components/OnboardingProgressDisplay';

// Full display
<OnboardingProgressDisplay showRefresh={true} />

// Compact display
<OnboardingProgressDisplay compact={true} showRefresh={false} />
```

### 2. Store Onboarding Data
```javascript
import { storeOnboardingStep } from './api/onboardingApi.js';

// Store height information
await storeOnboardingStep(1, {
  height: '175',
  unit: 'cm'
});

// Store emergency contact
await storeOnboardingStep(2, {
  emergency_contact_relation: 'Spouse',
  emergency_contact_name: 'John Doe',
  emergency_contact: '+1234567890'
});
```

### 3. Bulk Storage
```javascript
import { storeMultipleOnboardingSteps } from './api/onboardingApi.js';

const steps = [
  {
    step: 1,
    height: '175',
    unit: 'cm'
  },
  {
    step: 2,
    emergency_contact_relation: 'Spouse',
    emergency_contact_name: 'John Doe',
    emergency_contact: '+1234567890'
  }
];

await storeMultipleOnboardingSteps(steps);
```

### 4. Get Progress Data
```javascript
import { getOnboardingProgress } from './api/onboardingApi.js';

const progress = await getOnboardingProgress();
console.log('Progress:', progress.data);
```

## Error Handling

The system now includes comprehensive error handling:

- **404 Errors**: User onboarding data not found
- **401 Errors**: Authentication required
- **500+ Errors**: Server errors with retry suggestions
- **Network Errors**: Connection issues with helpful messages
- **API Errors**: Specific error messages from the backend

## Testing

Use the `OnboardingTestComponent` to verify integration:

1. Import and use the test component
2. Run individual tests or all tests at once
3. Check results for any integration issues
4. View live progress displays

## Best Practices

1. **Always check API responses** for success status
2. **Handle loading states** appropriately
3. **Provide user feedback** for all operations
4. **Use bulk operations** when storing multiple steps
5. **Implement proper error boundaries** in production
6. **Cache progress data** locally for offline access

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure you're importing from `.js` files, not `.ts`
2. **Authentication**: Verify tokens are properly stored in localStorage
3. **API Connectivity**: Use health check endpoint to verify connection
4. **Data Structure**: Ensure step data matches the expected format

### Debug Steps

1. Use the test component to isolate issues
2. Check browser console for detailed error messages
3. Verify API endpoints are accessible
4. Confirm user authentication is working
5. Test with sample data first

## Future Enhancements

Consider implementing:
- Offline support with local storage sync
- Real-time progress updates via WebSocket
- Step validation and data sanitization
- Progress analytics and reporting
- Multi-language support for step titles

## Support

For integration issues:
1. Check the test component results
2. Review browser console logs
3. Verify API endpoint accessibility
4. Test with the provided sample data structures

