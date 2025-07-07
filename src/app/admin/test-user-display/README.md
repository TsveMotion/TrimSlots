# Homepage User Info Box Testing Tool

This admin-only tool helps verify that the homepage info box correctly adapts to different user types without having to log in and out with multiple accounts.

## Features

- View a list of users with different roles from the database
- See detailed information about each user
- Preview how the homepage info box would appear for each user
- Verify that content adapts appropriately based on user role

## How to Use

1. Log in as an administrator
2. Navigate to `/admin/test-user-display`
3. Select different users from the list to see how their info box would appear
4. Use the "Show User View" / "Show Technical Info" toggle to switch between views
5. Verify that the displayed content matches the expectations in the test script

## Test Cases

The `test-script.ts` file contains detailed expectations for each user role:

- **Admin**: Should see system-wide data and all dashboard links
- **Business Owner**: Should see business-specific data and relevant dashboard links
- **Worker**: Should see their appointments and services they provide
- **Client**: Should see their bookings and relevant services

## Implementation Notes

- The preview functionality uses a simplified approach that shows user data
- A full implementation would require session mocking or server-compatible components
- This tool is for testing purposes only and should be restricted in production

## Security

- All endpoints are protected with admin-only access
- User data is only accessible to administrators
- No sensitive information like passwords is exposed

## Future Improvements

- Add ability to mock sessions more accurately
- Implement side-by-side comparison between different users
- Add automated testing for UI adaptation
