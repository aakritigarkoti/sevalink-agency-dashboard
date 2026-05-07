# SevaLink Agency Dashboard

A comprehensive management portal for healthcare agencies to manage their providers, track bookings, and monitor financial performance within the SevaLink ecosystem.

## Project Overview
The SevaLink Agency Dashboard is a React-based web application built with Next.js. It serves as the central hub for agencies to manage their operations, including provider onboarding, profile management, and service distribution tracking.

## Features Implemented
- **📊 Real-time Dashboard**: Overview of operational stats (Total/Active Bookings, Provider Count) and financial snapshots.
- **👨‍⚕️ Provider Management**: Complete lifecycle management for healthcare providers (Add, Edit, View Details, and Status tracking).
- **💼 Agency Profile**: Update and manage agency-specific details including registration numbers, GST, and contact information.
- **💰 Financial Tracking**: Automated calculation of earnings after platform commission (12%) and wallet balance monitoring.
- **📅 Booking Overview**: Track recent booking requests with status indicators (Pending, Confirmed, In Progress).
- **🔐 Secure Authentication**: JWT-based authentication with persistent sessions and secure logout.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI
- **Icons**: Lucide React
- **State/Data**: Fetch API with custom Auth wrappers
- **Notifications**: Sonner

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Sevalinkcare/sevalink-agency-dashboard.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (see below).
4. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=https://your-api-endpoint.com
```

## Folder Structure
- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable UI components (shadcn) and feature-specific components (dashboard, providers, layout).
- `lib/`: Core logic including API integration (`api.ts`), authentication (`local-auth.ts`), and configurations.
- `public/`: Static assets.

## Current Status
The project is in **Active Development (Internship Phase)**. Core agency and provider modules are fully integrated with the backend API. Financial modules use a mix of real data and simulated calculations for preview.

---
© 2024 SevaLink. All rights reserved.
