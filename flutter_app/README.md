# EduAttend Flutter App

This is the initial cross-platform frontend scaffold for EduAttend V14.

## Backend integration
The app reads the tenant-specific dashboard configuration from:

`GET /schools/:id/ui-config`

with:

`Authorization: Bearer <token>`

Run with a deployed API URL:

`flutter run --dart-define=API_BASE_URL=https://YOUR-API-DOMAIN`

## Current UI
- EduAttend branding
- Universal institute types
- Dynamic terminology/module concept
- Dashboard cards
- Mobile-friendly layout
- API client for tenant UI configuration

## Important
This scaffold is intentionally not claimed as a finished production mobile app.
Authentication, persistent token storage, real module screens, push notifications,
offline behavior, production API configuration, and release signing still require
the full Flutter source/product implementation and live backend validation.
