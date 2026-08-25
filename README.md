# JantaX

> A powerful, full-stack application for managing citizen services and government interactions.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Overview
JantaX is a comprehensive platform designed to streamline interactions between citizens and government agencies. Built with modern technologies like Node.js, TypeScript, React, and Prisma, it provides a secure and scalable solution for managing public services, complaints, requests, and information dissemination.

## Features
- **Citizen Portal**: User-friendly interface for submitting requests, tracking status, and accessing government services.
- **Admin Dashboard**: Powerful tools for government officials to manage requests, assign tasks, and generate reports.
- **Multi-role Authentication**: Secure role-based access control for citizens, officials, and administrators.
- **Real-time Notifications**: Instant updates via email and in-app notifications.
- **Document Management**: Upload, store, and retrieve documents related to requests and services.
- **Analytics & Reporting**: Visual dashboards and exportable reports for performance monitoring.
- **RESTful API**: Well-documented API for integration with third-party systems.
- **Internationalization**: Support for multiple languages (currently English and Hindi).
- **Responsive Design**: Fully responsive interface for mobile and desktop devices.
- **Docker Support**: Easy deployment using Docker containers.

## Architecture
![JantaX Architecture](docs/architecture.png)

JantaX follows a microservices-inspired architecture with clearly separated concerns:
- **Frontend**: React application with TypeScript, Tailwind CSS, and Vite.
- **Backend**: Node.js/TypeScript server with Express.js and Prisma ORM.
- **Database**: PostgreSQL (configurable via Prisma).
- **File Storage**: Local storage (configurable to AWS S3 or similar).
- **Authentication**: JWT-based authentication with role-based access control.
- **Real-time Communication**: WebSocket support for live updates (planned).

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0 or Yarn >= 1.22.0
- PostgreSQL >= 14.0
- Docker (optional, for containerized deployment)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/ZaidBuilds/JantaX.git
   cd JantaX
   ```

2. Install dependencies:
   ```bash
   # Install root dependencies
   npm install
   
   # Install server dependencies
   cd server
   npm install
   cd ..
   
   # Install client dependencies (if applicable)
   # (Adjust based on your project structure)
   ```

### Environment Setup
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` to configure:
   - Database connection string
   - JWT secret key
   - Email service credentials
   - File storage settings
   - Other environment-specific variables

3. Initialize the database:
   ```bash
   # From the server directory
   npx prisma migrate dev --name init
   ```

### Running the Application
#### Development Mode
```bash
# Start the server (from root)
npm run dev:server

# In another terminal, start the client
npm run dev:client
```

#### Production Mode
```bash
# Build the client
npm run build:client

# Start the server in production mode
npm start
```

#### Using Docker
```bash
# Build and start all services
docker-compose up --build

# Stop and remove containers
docker-compose down
```

## API Documentation
The API documentation is available at `/api-docs` when the server is running in development mode, or you can view the OpenAPI specification in `docs/openapi.yaml`.

## Database Schema
The database schema is defined using Prisma in `prisma/schema.prisma`. Key entities include:
- `User`: Represents system users with roles (citizen, official, admin)
- `Service`: Government services offered through the platform
- `Request`: Citizen requests for services or information
- `Response`: Official responses to requests
- `Document`: Attachments related to requests
- `Notification`: System notifications sent to users

## Testing
JantaX includes a comprehensive test suite:
```bash
# Run all tests
npm test

# Run backend tests only
npm run test:server

# Run frontend tests only
npm run test:client

# Run tests with coverage
npm run test:coverage
```

## Contributing
We welcome contributions from the community! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact
- Project Maintainer: ZaidBuilds
- GitHub: [https://github.com/ZaidBuilds](https://github.com/ZaidBuilds)
- Email: zaid@example.com

## Acknowledgments
- Inspired by various e-governance platforms worldwide
- Built with ❤️ using open-source technologies
- Special thanks to contributors and the open-source community