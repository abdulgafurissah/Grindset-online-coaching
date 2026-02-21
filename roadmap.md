🚀 FULL APPLICATION WORKFLOW (STAGE BY STAGE)
✅ STAGE 1 — Authentication & Role-Based Access Control
Objective:

Build the foundation of the system.

Implement:

User registration

Login system

Secure password hashing

Role-based access (Admin, Coach, Client)

Account status (Active / Suspended)

Rules:

Each user has one role.

Middleware must protect routes by role.

Suspended users cannot log in.

Core Fields:

id

name

email

password

role (admin | coach | client)

status (active | suspended)

✅ STAGE 2 — Client Registration & Full Biodata System
Objective:

Create complete client onboarding.

Client Registration Must Collect:

Personal Information

Full Name

Date of Birth

Gender

Phone Number

Email

WhatsApp

Emergency Contact

Health & Fitness Information

Weight

Height

Medical Conditions

Allergies

Fitness Goals

Lifestyle Habits

Any additional health notes

Admin Can:

View full client biodata

Edit client information

Suspend client

Delete client

Assign coach

Assign program

✅ STAGE 3 — Program Management System
Admin Capabilities

Admin can:

Add general programs

Edit programs

Delete programs

Assign programs to clients

General programs are visible to unassigned clients.

Coach Capabilities

Coach can:

Create programs

Create specialized programs

Edit their own programs

Delete their own programs

Add assigned clients into their specialized programs

⚠ Coaches cannot edit admin-created general programs.

✅ STAGE 4 — Coach Management (Admin Only)
Admin Can:

Approve coach accounts

Reject coach accounts

Suspend coach

Delete coach

Edit coach profile

Assign clients to coach

Coach Profile Should Include:

Specialization

Bio

Experience

Certification (optional)

Status

✅ STAGE 5 — Client–Coach Assignment Logic
System Logic Rules:

If a client is assigned to a coach:

Client sees only that coach’s specialized program.

If a client is NOT assigned:

Client sees general programs only.

Coaches:

See only clients assigned to them.

Cannot access other coaches’ clients.

Database Relationship:

client_id

coach_id

program_id

This must be relational and enforced at backend level.

✅ STAGE 6 — Messaging System
Admin Messaging Power

Admin can:

Message any coach

Message any client

Coach Messaging Limits

Coach can:

Message assigned clients only

Message admin

Cannot:

Message other coaches

Message unassigned clients

Client Messaging

Client can:

Message assigned coach

Message admin

Message Structure

sender_id

receiver_id

message

timestamp

read_status

✅ STAGE 7 — Admin Finance Management
Admin Dashboard Must Show:

Total revenue

Active subscriptions

Total clients

Revenue per program

Revenue per coach

Payment history

Subscription status

Admin Can:

View transactions

Manage subscriptions

Adjust payments (if needed)

Track coach earnings

✅ STAGE 8 — Coach Earnings & Finance Dashboard (NEW)
Objective:

Allow coaches to see their income transparently.

Coach Can View:

Total earnings

Earnings per client

Earnings per program

Monthly earnings summary

Pending payouts

Paid payouts history

Earnings Logic:

Revenue from clients assigned to a coach should:

Calculate coach commission percentage

Automatically track earnings per transaction

Example structure:

transaction_id

client_id

program_id

total_amount

coach_percentage

coach_earning

platform_earning

payout_status

Important Rules:

Coaches cannot edit financial records.

Coaches cannot see other coaches’ earnings.

Earnings must be calculated automatically.

Admin controls payout release.

🔥 Final Clean Build Order

Authentication & Roles

Client Registration & Biodata

Admin Dashboard

Coach Dashboard

Program CRUD

Assignment Logic

Messaging System

Admin Finance Module

Coach Earnings Dashboard