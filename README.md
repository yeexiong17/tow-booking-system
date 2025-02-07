# Tow Service Application

This is a web application for managing tow services.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 16 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository: `git clone https://github.com/yeexiong17/tow-booking-system.git`
2. Navigate to the project directory: `cd tow-booking-system`
3. Install dependencies: `npm install`

## Running the Application

1. Starting the development server: `npm start`
2. The application will be available at `http://localhost:3000` (or another port if 3000 is in use)

## Booking Status Reference

The application uses the following booking statuses:

| Status | Description |
|--------|-------------|
| Pending | Initial status when a customer creates a booking |
| In Progress | When a tow service provider accepts the booking |
| Completed | Service has been completed successfully |
| Cancelled | Booking was cancelled by either party |

## Customer Account Status

| Status | Description |
|--------|-------------|
| Active | Account is verified and can make bookings |
| Unactive | Unactive account, cannot make bookings |

## Tow Service Provider Details Status

| Status | Description |
|--------|-------------|
| Pending | Application is pending approval |
| Approved | Application is approved to provide services |
| Rejected | Application is rejected |