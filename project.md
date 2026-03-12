Society Subscription Management
 ADMIN PORTAL (Next.js App)
The admin app helps the society management team control all flats, subscriptions, and payments.

1. Admin Login Page
Path: /admin/login
Summary:
This page lets the society admins securely log into the admin system.
They must enter their email and password, which are verified using Auth0 (Google Sign In).
If login is successful, the admin goes to the Dashboard.

2. Admin Dashboard
Path: /admin/dashboard
Summary:
A bird’s-eye view of the society’s financial health.
Admins see key statistics like total flats, total money collected, pending payments, and monthly insights.
Can also show graphs/charts.



3. Flats Management Page
Path: /admin/flats
Summary:
This page lists all flats in the society with details like owner name, email, and phone.
Admins can add a flat, edit its details, or delete it.
Data tables (search, sort, paginate)
Modal forms for add/edit

4. Subscription Plans Page
Path: /admin/subscriptions
Summary:
Shows the current subscription amount flat type wise. (e.g., 2BHK- ₹1500/month, 3BHK- ₹1800/month ).
Admins can update the monthly rates.

5. Monthly Subscription Records Page
Path: /admin/monthly-records
Summary:
Shows every flat’s payment status for a selected month—paid or pending.
Admins can manually mark a flat’s subscription as paid.




6. Manual Payment Entry Page
Path: /admin/payment-entry
Summary:
Admins can record a payment if someone pays offline (Cash/UPI).
They select a flat and month, and enter payment details.

7. Reports Page
Path: /admin/reports
Summary:
Generates monthly and yearly financial reports.
Includes total collection, pending payments, payment-mode breakdown, etc.
Admins can download CSV/PDF.

8. Notifications Page
Path: /admin/notifications
Summary:
Let admins send reminders (e.g., “Payment due for February”).
Uses Firebase Cloud Messaging or OneSignal to push notifications to users.

9. Admin Profile Page
Path: /admin/profile
Summary:
Admins can update personal details or change passwords.
Useful for account security and personal customization.

END‑USER PORTAL (Resident App – Next.js)
Residents use this app to view their own subscription and payment history.

1. User Login Page
Path: /login
Summary:
Residents log in using their registered email and password.
This page ensures secure access to their own flat’s records only.

2. User Dashboard
Path: /dashboard
Summary:
Shows the resident a quick summary:
Current month’s subscription status
Any pending amount
Payment history overview
Notifications

3. Monthly Subscription Status Page
Path: /subscriptions
Summary:
List of monthly bills showing:
Amount
Status (Paid/Pending)
Payment mode
Link to view receipt
This gives users a full history of payments.

4. Detailed Subscription Page
Path: /subscriptions/[month]
Summary:
Detailed view for a particular month:
Full breakdown of charges
Payment date
Payment mode

5. Payment Page
Path: /pay-now
Summary:
Users can pay subscription online via Razorpay/Stripe.
On successful payment, an online receipt is generated.

6. User Profile Page
Path: /profile
Summary:
Residents can update their phone number or password.
They can also log out from this page.
Trainees learn:
Basic forms
Profile update API
Logout flow
Some Edge Cases to consider - 

What if admin deletes flat but payments exist?


What if user pays twice?


What if month record doesn’t exist yet?


What if plan changes mid-year?

What if a resident tries to access /admin/flats?

