# PlayMatch - Sports Court & Coach Booking Platform

PlayMatch is a modern web application designed to facilitate the booking of sports courts and professional coaches. Built with Angular and TailwindCSS, it provides a seamless user experience for sports enthusiasts to find, book, and manage their sports activities.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Building](#building)
- [Testing](#testing)
- [Project Architecture](#project-architecture)
- [Internationalization](#internationalization)

## Features

- **User Dashboard**: Personalized dashboard showing upcoming bookings, statistics, and recent activity.
- **Court Search**: Advanced search functionality to find sports courts by location, sport type, and availability.
- **Coach Finder**: Directory of professional coaches with filtering options for sport, level, and rating.
- **Booking System**: Streamlined process for reserving courts and scheduling coaching sessions.
- **Internationalization**: Full support for English and Spanish languages.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Authentication**: Secure login and registration flows.

## Technology Stack

- **Frontend Framework**: Angular
- **Styling**: TailwindCSS
- **State Management**: Angular Signals
- **Internationalization**: @ngx-translate/core
- **E2E Testing**: Playwright
- **Unit Testing**: Jasmine & Karma
- **Mock Backend**: JSON Server

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher recommended)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd playmatch
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Ensure the necessary environment files are set up in the `src/environments` directory or via the `.env` file if applicable.

## Development

To start the development server with the mock backend concurrently:

```bash
npm run dev
```

This command will:
1. Start the JSON Server on port 3000 (mock API).
2. Start the Angular application on port 4200.

Navigate to `http://localhost:4200/` in your browser. The application will automatically reload if you change any of the source files.

### Other Commands

- **Start App Only**: `npm start`
- **Start Mock API Only**: `npm run api`

## Building

To build the project for production:

```bash
npm run build:prod
```

The build artifacts will be stored in the `dist/` directory. This command optimizes the application for performance and production deployment.

## Testing

### Unit Tests

Run unit tests via Karma:

```bash
npm test
```

### End-to-End (E2E) Tests

Run E2E tests using Playwright:

```bash
npx playwright test
```

To run tests in UI mode:

```bash
npx playwright test --ui
```

## Project Architecture

The project follows a Domain-Driven Design (DDD) inspired architecture, organized by feature modules:

- **src/shared**: Common components, services, models, and utilities used across the application.
- **src/court**: Components and logic specific to court management and searching.
- **src/coach**: Components and logic specific to coach profiles and booking.
- **src/auth**: Authentication related views and services.

Each module is further divided into:
- **domain**: Models and interfaces.
- **infrastructure**: Services and API communication.
- **presentation**: Components, views, and UI logic.

## Internationalization

The application uses `@ngx-translate` for handling multiple languages. Translation files are located in `public/i18n/`.

- **English**: `public/i18n/en.json`
- **Spanish**: `public/i18n/es.json`

To add new translations, ensure keys are added to both files to maintain consistency.
