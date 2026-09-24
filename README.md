# JantaX

> Transforming citizen-government interactions through technology

![JantaX Banner](https://via.placeholder.com/1200x400/2563eb/ffffff?text=JantaX+%E2%80%94+Bridging+Citizens+and+Government)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.0-61dafb)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-blue)](https://www.postgresql.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

## 📋 Table of Contents
- [Overview](#overview)
- [✨ Features](#features)
- [🏗️ Architecture](#architecture)
- [🚀 Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Running the Application](#running-the-application)
- [📚 API Documentation](#api-documentation)
- [🗃️ Database Schema](#database-schema)
- [🧪 Testing](#testing)
- [🤝 Contributing](#contributing)
- [📄 License](#license)
- [📞 Contact](#contact)
- [𙏂 Acknowledgments](#acknowledgments)

## 👁️‍🗨️ Overview
JantaX is a comprehensive platform designed to streamline interactions between citizens and government agencies. Built with modern technologies like Node.js, TypeScript, React, and Prisma, it provides a secure and scalable solution for managing public services, complaints, requests, and information dissemination.

![Dashboard Preview](https://via.placeholder.com/800x450/4cc9f0/ffffff?text=JantaX+Dashboard+Preview)

## ✨ Features

### 👥 Citizen Portal
![Citizen Portal](https://via.placeholder.com/300x200/2563eb/ffffff?text=Citizen+Portal)
- Intuitive interface for submitting requests and tracking status
- Access to government services and information
- Personal dashboard with request history

### 🛠️ Admin Dashboard
![Admin Dashboard](https://via.placeholder.com/300x200/2563eb/ffffff?text=Admin+Dashboard)
- Powerful tools for managing requests and assigning tasks
- Real-time analytics and reporting
- User and role management

### 🔐 Security & Authentication
![Security](https://via.placeholder.com/300x200/2563eb/ffffff?text=Security)
- Multi-role authentication (citizen, official, admin)
- JWT-based secure access control
- Data encryption and privacy compliance

### 📱 Responsive Design
![Responsive](https://via.placeholder.com/300x200/2563eb/ffffff?text=Responsive+Design)
- Fully responsive interface for all devices
- Mobile-first approach
- Progressive Web App capabilities

### 📊 Analytics & Reporting
![Analytics](https://via.placeholder.com/300x200/2563eb/ffffff?text=Analytics)
- Visual dashboards with charts and graphs
- Exportable reports (PDF, CSV, Excel)
- Performance metrics and KPIs

### 📎 Document Management
![Documents](https://via.placeholder.com/300x200/2563eb/ffffff?text=Documents)
- Secure file upload and storage
- Document versioning and tracking
- Integration with cloud storage providers

### 🔄 Real-time Notifications
![Notifications](https://via.placeholder.com/300x200/2563eb/ffffff?text=Notifications)
- Instant email and in-app notifications
- Configurable alert preferences
- SMS gateway integration (planned)

### 🌐 Internationalization
![i18n](https://via.placeholder.com/300x200/2563eb/ffffff?text=i18n)
- Multi-language support (English, Hindi, more planned)
- Localization-ready architecture
- RTL language support

## 🏗️ Architecture
![Architecture Diagram](https://via.placeholder.com/800x500/4cc9f0/ffffff?text=JantaX+Architecture+Diagram)

JantaX follows a modern, scalable architecture with clearly separated concerns:

### Frontend Layer
- **React 18** with TypeScript and **React Router 7**, each screen lazy-loaded
- **Vite 5** for development and production builds
- **Design system** in plain CSS variables with light and dark themes (`src/tokens.css`, `src/components.css`), shared React primitives in `src/ui/`, and Tailwind utilities mapped to the same tokens. See [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)
- **Offline-first data layer**: when the API is unreachable, `src/core/services/api.ts` falls back to bundled sample records and a local search index, and the UI says so
- **Leaflet** maps, **lucide-react** icons, self-hosted Inter and Anek fonts

### Backend Layer
- **Node.js** with **Express.js** for robust API handling
- **TypeScript** for end-to-end type safety
- **Prisma ORM** for type-safe database operations
- **JWT** for secure authentication
- **WebSocket** support for real-time features (planned)

### Infrastructure
- **PostgreSQL** as primary relational database
- **Redis** for caching and session storage (planned)
- **Local file storage** with S3-compatible cloud integration
- **Docker** for containerized deployment
- **CI/CD** pipeline with GitHub Actions

### Security Features
- Role-Based Access Control (RBAC)
- Input validation and sanitization
- Rate limiting and DDoS protection
- Security headers and CSP
- Regular dependency auditing

## 🚀 Getting Started

### Prerequisites
Before you begin, ensure you have installed:
- [Node.js](https://nodejs.org/) (>= 18.0.0)
- [npm](https://www.npmjs.com/) (>= 9.0.0) or [Yarn](https://yarnpkg.com/) (>= 1.22.0)
- [PostgreSQL](https://www.postgresql.org/) (>= 14.0)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) (optional, for containerized deployment)

### Installation
Follow these steps to get your development environment running:

1. **Clone the repository**
   ```bash
   git clone https://github.com/ZaidBuilds/JantaX.git
   cd JantaX
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install server dependencies
   cd server
   npm install
   cd ..
   
   # Install client dependencies (if in separate directory)
   # cd client && npm install && cd ..
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Initialize the database**
   ```bash
   # From the server directory
   npx prisma migrate dev --name init
   npx prisma generate
   ```

### Environment Setup
Configure your `.env` file with these essential variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/jantax"

# Server
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Email (for notifications)
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="your-email@example.com"
SMTP_PASS="your-email-password"

# File Storage
STORAGE_TYPE="local"  # or "s3"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_BUCKET_NAME="jantax-uploads"
AWS_REGION="us-east-1"

# App
FRONTEND_URL="http://localhost:3000"
```

### Running the Application

#### Development Mode
```bash
# Terminal 1: Start the server
npm run dev:server

# Terminal 2: Start the client
npm run dev:client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Docs: http://localhost:3001/api-docs

#### Production Mode
```bash
# Build the client
npm run build:client

# Start the server
npm start
```

#### Using Docker
```bash
# Build and start all services
docker-compose up --build

# View logs
docker-compose logs -f

# Stop and remove containers
docker-compose down
```

## 📚 API Documentation
Explore our interactive API documentation:

- **Swagger UI**: Visit `/api-docs` when the server is running
- **OpenAPI Specification**: View the raw specification in `docs/openapi.yaml`
- **Postman Collection**: Import `docs/JantaX.postman_collection.json`

### Key API Endpoints
```
GET    /api/services          # List available government services
POST   /api/requests          # Submit a new service request
GET    /api/requests/:id      # Get request details
PUT    /api/requests/:id      # Update request status
POST   /api/requests/:id/documents # Upload supporting documents
GET    /api/notifications     # Get user notifications
POST   /api/auth/login        # User authentication
```

## 🗃️ Database Schema
![Database Schema](https://via.placeholder.com/800x500/4cc9f0/ffffff?text=JantaX+Database+Schema)

Our database schema is designed for scalability and clarity using Prisma ORM:

### Core Entities
- **User**: Citizens, officials, and administrators with role-based permissions
- **Service**: Government services offered through the platform
- **Request**: Citizen submissions for services, information, or assistance
- **Response**: Official replies and resolutions to requests
- **Document**: Attachments and supporting files related to requests
- **Notification**: System alerts and communications to users
- **AuditLog**: Tracking of all system changes for compliance

### Relationships
- One-to-Many: User → Requests (citizen submits multiple requests)
- One-to-Many: Service → Requests (service type categorizes requests)
- One-to-Many: Request → Responses (officials can provide multiple updates)
- One-to-Many: Request → Documents (multiple attachments per request)
- One-to-Many: User → Notifications (users receive multiple alerts)

## 🧪 Testing
We maintain high code quality through comprehensive testing:

![Testing Badge](https://via.placeholder.com/400x100/2563eb/ffffff?text=80%25+Test+Coverage)

```bash
# Run all tests
npm test

# Run backend tests only
npm run test:server

# Run frontend tests only
npm run test:client

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode (development)
npm run test:watch
```

### Test Types
- **Unit Tests**: Individual functions and components
- **Integration Tests**: API endpoints and database interactions
- **End-to-End Tests**: User flows using Playwright
- **Visual Regression Tests**: UI component consistency

## 🤝 Contributing
We love contributions! Help us make JantaX better for everyone.

![Contributing](https://via.placeholder.com/800x200/4cc9f0/ffffff?text=Join+Our+Community)

### How to Contribute
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Guidelines
- Follow the existing code style (ESLint and Prettier configured)
- Write tests for new features and bug fixes
- Update documentation as needed
- Keep pull requests focused and well-described
- Be respectful and constructive in discussions

### Good First Issues
Look for issues labeled `good first issue` and `help wanted` in our [issue tracker](https://github.com/ZaidBuilds/JantaX/issues).

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2026 ZaidBuilds

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
```

## 📞 Contact
Get in touch with the JantaX team:

- **Project Maintainer**: ZaidBuilds
- **GitHub**: [https://github.com/ZaidBuilds](https://github.com/ZaidBuilds)
- **Twitter**: [@ZaidBuilds](https://twitter.com/ZaidBuilds)
- **LinkedIn**: [zaidbuilds](https://linkedin.com/in/zaidbuilds)
- **Email**: opensource@zaidbuilds.com
- **Discord**: [Join our community](https://discord.gg/jantax)

## 🙏 Acknowledgments
JantaX stands on the shoulders of giants and open-source collaboration:

- **Inspired by**: Various e-governance platforms worldwide including UMANG, MyGov, and Digital India initiatives
- **Built with**: ❤️ using open-source technologies from incredible developers
- **Special thanks to**: Contributors, reviewers, and the open-source community
- **Tooling**: Thanks to the creators of React, Node.js, Prisma, Tailwind, and all our dependencies
- **Community**: To everyone who has reported issues, suggested features, or submitted pull requests

---

<div align="center">
  Made with ❤️ for better citizen-government interactions<br>
  <a href="https://github.com/ZaidBuilds/JantaX"><img src="https://img.shields.io/badge/GitHub-Repository-blue?logo=github" alt="GitHub Repository"></a>
  <a href="https://github.com/ZaidBuilds/JantaX/stargazers"><img src="https://img.shields.io/github/stars/ZaidBuilds/JantaX?style=social" alt="GitHub Stars"></a>
</div>