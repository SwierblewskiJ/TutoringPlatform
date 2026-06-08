# "Kredkorepetycje" - Tutoring Platform
A platform connecting students and tutors. The system allows users to browse tutoring offers, manage availability schedules, and book lesson slots. Communication with the API is secured using JWT token-based authorization.

---

## Key Features

* **User Management:** Registration and login with role-based access control (Student and Tutor).
* **Tutoring Ads Board:** Creating, editing, deleting, and browsing tutoring offers.
* **Availability Calendar:** Tutors can define their availability time frames (lesson blocks ranging from 45 minutes to 3 hours).
* **Booking System:** Students book specific time slots based on the tutor's availability (requires at least 1 day's advance notice). The system prevents scheduling conflicts and double bookings.
* **Lesson Statuses:** Tracking and changing lesson statuses (Pending, Confirmed, Completed, Cancelled) depending on the user's permissions.

---

## Installation & Setup

### 1. Database (Docker required)
```bash
docker compose up -d
```

### 2. Backend Setup (.NET 10 SDK required)
The server uses Entity Framework Core. When run on an empty database, the application will automatically apply migrations and run the `DatabaseSeeder`, which populates the database with sample test data (users, ads, availability slots).
```bash
cd backend/TutoringPlatform
dotnet run
```
The application will start by default at: `http://localhost:5192`.

API Documentation (Swagger) is available at: `http://localhost:5192/swagger`.

*To reset the database and reload the test data, run:*
```bash
dotnet ef database drop
dotnet ef database update
```

### 3. Frontend Setup (Node.js required)
```bash
cd frontend/TutoringPlatformFeReact
npm install
npm run dev
```
The application will start by default at: `http://localhost:5173`.

---

## Authorization and Permissions

Most data-modifying operations (POST, PUT, PATCH, DELETE methods) require authentication. The JWT token must be provided in the HTTP request header:
`Authorization: Bearer {token}`

The system verifies permissions at the business logic level:
* **Role: Tutor:** Has permissions to create and edit only their own ads, manage their own schedule, and change the status of lessons assigned to them.
* **Role: Student:** Has permissions to book time slots and cancel only their own lessons.