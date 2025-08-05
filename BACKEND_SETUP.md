# Backend Setup Guide

## Current Status

The frontend is currently running in **MOCK MODE** to avoid connection errors.

## To Enable Real API:

### 1. Update Contact Service

In `src/services/contactService.ts`:

```typescript
const USE_MOCK_DATA = false; // Change this to false
const API_BASE_URL = 'https://your-api-domain.com'; // Update to your real API URL
```

### 2. Backend Requirements

Your backend should be running and provide these endpoints:

- `GET /api/contacts?userId=default&sortBy=priority`
- `POST /api/contacts` (with userId in body)
- `PUT /api/contacts/:id/last-contact`
- `DELETE /api/contacts/:id?userId=default`

### 3. Test Connection

1. Start your backend server
2. Update the settings above
3. Refresh the app
4. Try adding a contact

## Mock Mode Features

Currently working features in mock mode:

- ✅ Add new contacts (stored in memory)
- ✅ Update last contact date
- ✅ View contacts list
- ✅ Empty state when no contacts
- ✅ All UI interactions work

## Switching Back to Mock

If you need to go back to mock mode:

```typescript
const USE_MOCK_DATA = true;
```

This prevents connection errors while developing the backend.
