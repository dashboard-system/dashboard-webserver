# Dashboard Webserver

A robust Node.js/TypeScript backend server that powers the [Dashboard UI](https://github.com/Coffee-Dog/dashboard-ui). This server provides secure authentication, user management, and API endpoints for a comprehensive dashboard system.

## 🚀 Features

- **🔐 JWT-based Authentication** - Secure token-based authentication with role-based access control
- **👥 User Management** - Complete CRUD operations for user accounts with role management
- **🗃️ SQLite Database** - Lightweight, embedded database with automated schema management
- **🔒 Password Security** - bcrypt encryption with 12 salt rounds for maximum security
- **📊 Health Monitoring** - Comprehensive health checks for system and database status
- **🛡️ Security Middleware** - Helmet.js security headers, CORS protection, and request validation
- **📝 Comprehensive Logging** - Morgan HTTP request logging with configurable levels
- **🔧 Environment Configuration** - Flexible configuration via environment variables
- **📦 Automated Setup** - Shell scripts for easy project initialization and user management

## 🏗️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: SQLite with better-sqlite3
- **Authentication**: JWT (jsonwebtoken) + bcrypt
- **Security**: Helmet.js, CORS, express rate limiting
- **Development**: ts-node, nodemon for hot reload

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- bash (for initialization scripts)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/Coffee-Dog/dashboard-webserver.git
cd dashboard-webserver
npm install
```

### 2. Initialize Project

```bash
# Make scripts executable
chmod +x ./script/init.sh ./script/auth.sh

# Initialize database and configuration
./script/init.sh

# Create default users (engineer & maintainer)
./script/auth.sh
```

### 3. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## 🗄️ Database Schema

### Users Table

| Column       | Type                | Description                                   |
| ------------ | ------------------- | --------------------------------------------- |
| `id`         | INTEGER PRIMARY KEY | Auto-incrementing user ID                     |
| `username`   | TEXT UNIQUE         | Username for login (engineer, maintainer)     |
| `password`   | TEXT                | bcrypt-hashed password (12 salt rounds)       |
| `role`       | TEXT                | User role (engineer, maintainer, admin, user) |
| `created_at` | DATETIME            | Account creation timestamp                    |
| `updated_at` | DATETIME            | Last update timestamp                         |

## 🔑 Default Users

After running the initialization scripts, two default users are created:

| Username     | Password             | Role       |
| ------------ | -------------------- | ---------- |
| `engineer`   | `engineerpassword`   | engineer   |
| `maintainer` | `maintainerpassword` | maintainer |

> **Security Note**: Change these default passwords in production!

## 📡 API Endpoints

### Authentication

| Method | Endpoint             | Description              | Auth Required |
| ------ | -------------------- | ------------------------ | ------------- |
| `POST` | `/api/auth/login`    | User login               | ❌            |
| `POST` | `/api/auth/register` | User registration        | ❌            |
| `GET`  | `/api/auth/me`       | Get current user profile | ✅            |
| `PUT`  | `/api/auth/profile`  | Update own profile       | ✅            |
| `POST` | `/api/auth/refresh`  | Refresh JWT token        | ✅            |
| `POST` | `/api/auth/logout`   | User logout              | ✅            |

### User Management

| Method   | Endpoint             | Description            | Auth Required | Role Required |
| -------- | -------------------- | ---------------------- | ------------- | ------------- |
| `GET`    | `/api/users`         | List users (paginated) | ✅            | admin         |
| `GET`    | `/api/users/:id`     | Get user by ID         | ✅            | admin         |
| `POST`   | `/api/users`         | Create new user        | ✅            | admin         |
| `PUT`    | `/api/users/:id`     | Update user            | ✅            | admin         |
| `DELETE` | `/api/users/:id`     | Delete user            | ✅            | admin         |
| `GET`    | `/api/users/profile` | Get own profile        | ✅            | any           |

### Health Checks

| Method | Endpoint           | Description           | Auth Required |
| ------ | ------------------ | --------------------- | ------------- |
| `GET`  | `/health`          | Basic health check    | ❌            |
| `GET`  | `/health/detailed` | Detailed system info  | ❌            |
| `GET`  | `/health/database` | Database health check | ❌            |

## 🔧 Configuration

### Environment Variables

Create a `.env` file (auto-generated by init script):

```env
# Database Configuration
DATABASE_PATH=./db/sqlite.db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=development

# Logging
LOG_LEVEL=info
LOG_DIR=./logs
```

### Directory Structure

```
dashboard-webserver/
├── src/
│   ├── config/
│   │   └── database.ts          # Database connection & management
│   ├── middleware/
│   │   └── auth.ts              # JWT authentication middleware
│   ├── models/
│   │   └── User.ts              # User model with CRUD operations
│   ├── routes/
│   │   ├── auth.ts              # Authentication endpoints
│   │   ├── users.ts             # User management endpoints
│   │   └── health.ts            # Health check endpoints
│   ├── types/
│   │   └── auth.ts              # TypeScript type definitions
│   ├── utils/
│   │   ├── jwt.ts               # JWT utility functions
│   │   └── password.ts          # Password hashing utilities
│   └── index.ts                 # Main server file
├── script/
│   ├── init.sh                  # Project initialization script
│   └── auth.sh                  # User management script
├── db/                          # SQLite database directory
├── logs/                        # Application logs
└── .env                         # Environment configuration
```

## 🔨 Development Scripts

```bash
# Development with hot reload
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint
```

## 🛠️ Management Scripts

### Project Management

```bash
# Initialize project
./script/init.sh init

# Reset project (removes all data)
./script/init.sh reset

# Show help
./script/init.sh help
```

### User Management

```bash
# Initialize default users
./script/auth.sh init

# Reset all users
./script/auth.sh reset

# List all users
./script/auth.sh list

# Show help
./script/auth.sh help
```

## 🔐 Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Tokens**: Secure token-based authentication with expiration
- **Role-based Access Control**: Different permission levels for different user roles
- **Security Headers**: Helmet.js for security headers
- **CORS Protection**: Configurable cross-origin resource sharing
- **Input Validation**: Request body validation and sanitization
- **Rate Limiting**: Protection against brute force attacks

## 🧪 Testing Examples

### Login Request

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "engineer",
    "password": "engineerpassword"
  }'
```

### Protected Route Access

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Health Check

```bash
curl http://localhost:3000/health/detailed
```

## 🐳 Docker Support

```dockerfile
# Dockerfile example
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## 🚀 Deployment

### Production Checklist

- [ ] Update `JWT_SECRET` to a secure random value
- [ ] Change default user passwords
- [ ] Set `NODE_ENV=production`
- [ ] Configure proper logging
- [ ] Set up database backups
- [ ] Configure reverse proxy (nginx)
- [ ] Set up SSL/TLS certificates
- [ ] Configure firewall rules

### Environment Setup

```bash
# Production environment variables
export NODE_ENV=production
export JWT_SECRET=$(openssl rand -base64 32)
export DATABASE_PATH=/data/sqlite.db
export PORT=3000
```

## 📊 Monitoring

The server provides comprehensive health endpoints for monitoring:

- **Basic Health**: `/health` - Server status and uptime
- **Detailed Health**: `/health/detailed` - Memory, environment, database stats
- **Database Health**: `/health/database` - Database connectivity and user stats

## 🤝 Integration with Dashboard UI

This webserver is designed to work seamlessly with the [Coffee-Dog Dashboard UI](https://github.com/Coffee-Dog/dashboard-ui):

- **CORS Configuration**: Pre-configured for frontend integration
- **RESTful APIs**: Standard REST endpoints for easy frontend consumption
- **WebSocket Ready**: Architecture supports real-time features
- **Role-based UI**: Different user roles can access different UI components

## 🔧 Troubleshooting

### Common Issues

**Database Connection Issues**

```bash
# Check database health
curl http://localhost:3000/health/database

# Reset database
./script/init.sh reset
```

**Authentication Issues**

```bash
# Verify JWT token
curl -X POST http://localhost:3000/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"token": "YOUR_TOKEN"}'
```

**Permission Issues**

```bash
# Make scripts executable
chmod +x ./script/*.sh
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and questions:

- Create an issue in this repository
- Check the [Dashboard UI repository](https://github.com/Coffee-Dog/dashboard-ui) for frontend-related issues

## 🗺️ Roadmap

- [ ] Redis session storage
- [ ] Rate limiting middleware
- [ ] API documentation with Swagger
- [ ] Unit and integration tests
- [ ] Docker compose setup
- [ ] Kubernetes deployment configs
- [ ] Metrics and analytics endpoints
