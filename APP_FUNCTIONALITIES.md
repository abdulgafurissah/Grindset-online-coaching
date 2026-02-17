# 🏋️ Grindset Online Coaching - App Functionalities

This document outlines the core functionalities and features of the **Grindset Online Coaching** application.

## 🚀 Core Features

### 🔐 Authentication & Security
*   **Secure Sign-Up & Login**: Users can create accounts and log in securely using email and password.
*   **Role-Based Access Control (RBAC)**: The system supports three distinct user roles with specific permissions:
    *   **Client**: Standard user accessing coaching services.
    *   **Coach**: Professional managing clients and programs.
    *   **Admin**: System administrator with full oversight.
*   **Session Management**: Persistent login sessions with secure logout functionality.
*   **Protected Routes**: Dashboard and specific feature pages are restricted to authenticated users only.

### 📱 Responsive Design (Mobile-First)
*   **Universal Compatibility**: The entire application is optimized for all devices, from large desktop monitors to mobile phones.
*   **Mobile Navigation**:
    *   **Navbar**: Collapsible hamburger menu for easy navigation on small screens.
    *   **Dashboard Sidebar**: Slide-out sidebar on mobile devices with backdrop overlay, ensuring maximum screen real estate for content.

---

## 👤 User Roles & Capabilities

### 1. Guest / Public User
*   **Landing Page**: Access to the high-performance landing page featuring:
    *   **Hero Section**: Compelling introduction to the brand.
    *   **Features**: Overview of what the platform offers.
    *   **Mindset**: Motivational content.
    *   **Top Coaches**: Showcase of available coaches.
    *   **Real Results**: Testimonials and transformation stories.
*   **Pricing Page**: View subscription plans and pricing details.
*   **Coaches Page**: Browse available coaches (public directory).
*   **Registration**: Sign up for a new account.

### 2. Client (The Athlete)
*   **Personal Dashboard**: a central hub for tracking fitness journey.
*   **My Program**: View assigned workout programs and exercises.
*   **Nutrition Tracking**: Log daily meals and track macronutrients (Calories, Protein, Carbs, Fats).
*   **Progress Tracking**: Log weight, body metrics, and upload progress photos.
*   **Messages**: Communicate directly with assigned coaches.
*   **Settings**: Manage profile and account preferences.

### 3. Coach
*   **Coach Dashboard**: Overview of assigned clients and their activities.
*   **Client Management**: View client profiles, assign programs, and monitor their progress.
*   **Program Builder**: Tools to create and customize workout programs and exercises.
*   **Messages**: Chat with clients to provide guidance and feedback.

### 4. Admin
*   **Admin Dashboard**: High-level view of the application's health and stats.
*   **User Management**: View and manage all users (Clients and Coaches).
*   **System Admin**: Configuration and system-wide settings.

---

## 🛠️ Technical Stack & Infrastructure

*   **Framework**: [Next.js](https://nextjs.org/) (App Router) - For high-performance server-side rendering and static generation.
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) - For rapid, responsive, and custom design.
*   **Database**: [PostgreSQL](https://www.postgresql.org/) (hosted on Neon/Vercel) - Relational database for structured data.
*   **ORM**: [Prisma](https://www.prisma.io/) - For type-safe database database interactions.
*   **Authentication**: [NextAuth.js](https://next-auth.js.org/) (v5) - For secure authentication flow.
*   **Deployment**: [Vercel](https://vercel.com/) - For global edge deployment and serverless functions.
*   **Icons**: [Lucide React](https://lucide.dev/) - For consistent and beautiful iconography.

## 🔄 Recent Updates
*   **Mobile Responsiveness**: Fixed dashboard layout to be fully responsive with a slide-out sidebar on mobile.
*   **Navigation**: "Dashboard" link now appears in the main navigation bar for logged-in users for easier access.
*   **User Experience**: Enhanced error reporting during account creation and improved logout functionality.
