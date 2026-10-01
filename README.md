# QuickServe: Home Services Platform

QuickServe is a modern, full-stack home services marketplace application designed to connect customers with reliable local service providers (Cleaners, Plumbers, Electricians, etc.). 

The platform features a fully-fledged Customer Portal, Provider Dashboard, and an Admin Panel.

## 🚀 Key Features

* **Multi-Role Authentication**: Seamless, unified login experience for Customers, Service Providers, and Administrators.
* **Customer Dashboard**:
    * Browse, search, and filter available home services.
    * Book services with selected dates and times.
    * Leave ratings and feedback for completed services.
    * Track previous and upcoming service bookings.
* **Service Provider Dashboard**:
    * A comprehensive suite for providers to manage their offerings.
    * Real-time notifications for incoming booking requests.
    * Accept or reject bookings logic.
    * Track total earnings from completed jobs.
    * View customer reviews and average ratings.
* **Admin Dashboard**:
    * Full visibility over the platform's data.
    * Manage user accounts, verify providers, and monitor all platform bookings.

## 🛠️ Technology Stack

* **Frontend**: React (with Vite), TypeScript, Tailwind CSS, Lucide React Icons
* **Backend**: Spring Boot 3, Java 17, Maven
* **Database & Authentication**: Supabase (PostgreSQL, Auth, RLS)

## 📦 Project Structure

* `src/`: Contains all React frontend code (components, api hooks, layouts, types).
* `backend/`: Contains the Spring Boot server handling REST API operations and business logic.
* `supabase_schema.sql`: Contains the complete database structure, tables, and Row Level Security (RLS) policies.

## ⚙️ Setup & Installation

**Prerequisites:** Node.js, Java 17+, Maven, and a Supabase Project.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ishwardeshmukh15/QuickServeProject_TeamC.git
   cd QuickServeProject_TeamC
   ```

2. **Database Setup (Supabase):**
   * Create a new Supabase project.
   * Run the SQL commands found in `supabase_schema.sql` in your Supabase SQL Editor.
   * Note down your Project URL and Anon Key.

3. **Frontend Setup:**
   ```bash
   # Install dependencies
   npm install

   # Setup environment variables
   # Create a .env file in the root directory and add:
   # VITE_SUPABASE_URL=your_supabase_url
   # VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

   # Run the development server
   npm run dev
   ```

4. **Backend Setup:**
   ```bash
   cd backend

   # Update application.properties with your database credentials
   # src/main/resources/application.properties

   # Run the Spring Boot application
   ./mvnw spring-boot:run
   ```
