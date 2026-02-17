
# 🔐 Test Account Credentials

Here are the pre-configured test accounts for the application.

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| **Admin** | `admin@grindset.com` | `password123` | Has full access to the system. |
| **Coach** | `coach@grindset.com` | `password123` | Can manage clients, create programs, and track progress. |
| **Client** | `client@grindset.com` | `password123` | Assigned to **Coach Carter**, can view programs and log progress. |

> **Note:** These accounts are generated via `npx prisma db seed`. If the database is reset, run the seed command to restore them.
