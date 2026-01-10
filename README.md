# Acquisitions API

A production-ready Express.js REST API with JWT authentication, user management, role-based access control, and automated CI/CD.

## 🚀 Features

- JWT authentication with HTTP-only cookies
- User CRUD operations with role-based access (user/admin)
- PostgreSQL + Drizzle ORM + Neon serverless
- Request validation with Zod
- Docker support with hot-reload
- GitHub Actions CI/CD (lint, test, build)
- Structured logging with Winston

## 🛠 Tech Stack

**Backend**: Node.js 18, Express.js 5, JWT, bcrypt  
**Database**: PostgreSQL, Drizzle ORM, Neon  
**Tools**: Docker, Jest, ESLint, Prettier

## 📦 Quick Start

### Prerequisites

Node.js 18+, Docker, npm

## 💻 Installation

```bash
# Clone and install
git clone https://github.com/tusharshah21/acquisitions.git
cd acquisitions
npm install

# Setup environment
cp .env.example .env.development
# Edit .env.development with your credentials

# Run with Docker (recommended)
npm run docker:dev

# Or run locally
npm run db:migrate
npm run dev
```

See [DOCKER.md](./DOCKER.md) for detailed setup.

## 🔐 Environment Variables

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgres://neon:npg@neon-local:5432/neondb
NEON_API_KEY=your_neon_api_key
NEON_PROJECT_ID=your_project_id
JWT_SECRET=your-secret-key
```

## 🏃 Scripts

```bash
npm run dev          # Dev server with hot reload
npm start            # Production server
npm test             # Run tests
npm run lint:fix     # Fix linting issues
npm run format       # Format code
npm run docker:dev   # Start Docker dev
npm run docker:stop  # Stop Docker
npm run db:migrate   # Run migrations
npm run db:studio    # Open DB GUI
```

## 📚 API Documentation

### Base URL

```
Development: http://localhost:3000
Production: https://your-domain.com
```

### Health Check

```http
GET /health
```

**Response:**

```json
{
  "status": "OK",
  "timestamp": "2026-01-10T12:00:00.000Z",
  "uptime": 123.45
}
```

### Authentication Endpoints

#### Sign Up

```http
POST /api/auth/sign-up
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"  // Optional: "user" or "admin", defaults to "user"
}
```

#### Sign In

````http
POST /api/Endpoints

**Base URL**: `http://localhost:3000`

### Authentication (Public)
- `POST /api/auth/sign-up` - Register user
- `POST /api/auth/sign-in` - Login user
- `POST /api/auth/sign-out` - Logout user

### Users (Protected)
- `GET /api/users` - Get all users (authenticated)
- `GET /api/users/:id` - Get user by ID (authenticated)
- `PUT /api/users/:id` - Update user (own profile or admin)
- `DELETE /api/users/:id` - Delete user (admin only)

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"pass123"}'
````

**Authorization Rules:**

- Users can update their own profile (except role)
- Admins can update/delete any user and change roles

Tests are located in the `tests/` directory and use Jest with Supertest.

## 🔄 CI/CD

Three automated GitHub Actions workflows:

1. **Lint & Format** - ESLint + Prettier on push/PR
2. **Tests** - Jest with coverage reports on push/PR
3. **Docker Build** - Multi-platform build and push to Docker Hub

**Required Secrets**: `DOCKER_USERNAME`, `DOCKER_PASSWORD`

## 📁 Project Structure

````
acquisitions/
├── .github/
│   └── workflows/          # GitHub Actions CI/CD workflows
│       ├── lint-and-format.yml
│       ├── tests.yml
│       └── docker-build-and-push.yml
├── drizzle/                # Database migrations
├── logs/                   # Application logs
├── src/
│   ├── config/            # Configuration files
│   │   ├── database.js
│   │   └── logger.js
│   ├── controllers/       # Request handlers
│   │   ├── auth.controller.js
│   │   └── users.controller.js
│   ├── middleware/        # Custom middleware
│   │   └── auth.middleware.js
│   ├── models/            # Database models (Drizzle schemas)
│   │   └── user.model.js
│   ├── routes/            # API routes
│   │   ├── auth.routes.js
│   │   └── users.routes.js
│   ├── services/          # Business logic
│   │   ├── auth.service.js
│   │   └── users.services.js
│   ├── utils/             # Utility functions
│   │   ├── cookies.js
│   │   └── jw

**Schema**: Users table with id, name, email (unique), password (hashed), role, timestamps

```bash
npm run db:generate  # Generate migrations
npm run db:migrate   # Apply migrations
npm run db:studio    # Open GUI
````

## 🧪 Testing

```bash
npm test              # Run tests
npm test -- --coverage  # With coverage
```

## 🔒 Security Best Practices

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens stored in HTTP-only cookies
- ✅ Helmet.js for security headers
- ✅ CORS configured
- ✅ Input validation with Zod
- ✅ SQL injection prevention via Drizzle ORM
- ✅ Environment variables for sensitive data
- ✅ Non-root user in Docker containers
- ✅ Rate limiting (recommended to add)
- ✅ HTTPS in production (recommended)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run linter and tests (`npm run lint && npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style

- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## � Author

**Tushar Shah** - [@tusharshah21](https://github.com/tusharshah21)

## 📝 License

ISC

---

**Built with Node.js & Express.js**
