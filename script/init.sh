#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project configuration
DB_DIR="./db"
DB_FILE="$DB_DIR/sqlite.db"
BACKUP_DIR="./db/backups"

print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}       Project Initialization${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

init_project() {
    print_header
    echo -e "${BLUE}Initializing project...${NC}"

    # Create necessary directories
    echo "Creating directories..."
    mkdir -p "$DB_DIR"
    mkdir -p "$BACKUP_DIR"
    mkdir -p "./logs"
    print_success "Directories created"

    # Create database if it doesn't exist
    if [ ! -f "$DB_FILE" ]; then
        echo "Creating database..."
        touch "$DB_FILE"
        print_success "Database file created at $DB_FILE"
    else
        print_warning "Database already exists at $DB_FILE"
    fi

    # Initialize database schema
    echo "Initializing database schema..."
    node -e "
        const Database = require('better-sqlite3');
        const db = new Database('$DB_FILE');
        
        db.exec(\`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'user',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            
            CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
            CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
            
            CREATE TRIGGER IF NOT EXISTS update_users_timestamp
            AFTER UPDATE ON users
            BEGIN
                UPDATE users SET updated_at = datetime('now') WHERE id = NEW.id;
            END;
        \`);
        
        console.log('Database schema initialized with users table');
        console.log('Schema includes: id, username, password, role, created_at, updated_at');
        db.close();
    "
    print_success "Database schema initialized"

    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        echo "Creating .env file..."
        # Generate a secure JWT secret
        JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || echo "your-super-secret-jwt-key-change-this-in-production-$(date +%s)")
        
        cat >.env <<EOF
# Database Configuration
DATABASE_PATH=./db/sqlite.db

# JWT Configuration
JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=development

# Logging
LOG_LEVEL=info
LOG_DIR=./logs

# Dashboard UI Configuration (for CORS)
DASHBOARD_UI_URL=http://localhost:3001
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:3000
EOF
        print_success ".env file created with secure JWT secret"
    else
        print_warning ".env file already exists"
    fi

    # Create package.json scripts if they don't exist
    if [ -f "package.json" ] && ! grep -q "\"dev\":" package.json; then
        echo "Adding development scripts to package.json..."
        node -e "
            const fs = require('fs');
            const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            
            if (!pkg.scripts) pkg.scripts = {};
            
            pkg.scripts = {
                ...pkg.scripts,
                'dev': 'nodemon --exec ts-node src/index.ts',
                'build': 'tsc',
                'start': 'node dist/index.js',
                'test': 'echo \"Error: no test specified\" && exit 1',
                'lint': 'eslint src/**/*.ts'
            };
            
            fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
            console.log('Scripts added to package.json');
        " 2>/dev/null || print_warning "Could not update package.json scripts"
    fi

    print_success "Project initialization complete!"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Run: ${GREEN}./script/auth.sh${NC} to create default users"
    echo "2. Run: ${GREEN}npm run dev${NC} to start the development server"
    echo "3. Visit: ${GREEN}http://localhost:3000/health${NC} to check server status"
}

reset_project() {
    print_header
    echo -e "${YELLOW}Resetting project...${NC}"

    read -p "Are you sure you want to reset the project? This will delete all data! (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Reset cancelled."
        exit 0
    fi

    # Backup existing database
    if [ -f "$DB_FILE" ]; then
        BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S).db"
        cp "$DB_FILE" "$BACKUP_DIR/$BACKUP_NAME"
        print_success "Database backed up to $BACKUP_DIR/$BACKUP_NAME"
    fi

    # Remove database
    if [ -f "$DB_FILE" ]; then
        rm "$DB_FILE"
        print_success "Database removed"
    fi

    # Remove logs
    if [ -d "./logs" ]; then
        rm -rf "./logs"/*
        print_success "Logs cleared"
    fi

    # Reinitialize
    init_project
    print_success "Project reset complete!"
}

check_requirements() {
    print_header
    echo -e "${BLUE}Checking system requirements...${NC}"
    
    # Check Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js found: $NODE_VERSION"
    else
        print_error "Node.js not found! Please install Node.js v16 or higher"
        exit 1
    fi
    
    # Check npm
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_success "npm found: $NPM_VERSION"
    else
        print_error "npm not found! Please install npm"
        exit 1
    fi
    
    # Check if better-sqlite3 is installed
    if [ -f "package.json" ] && grep -q "better-sqlite3" package.json; then
        print_success "better-sqlite3 dependency found"
    else
        print_warning "better-sqlite3 not found in package.json"
        echo "Run: npm install better-sqlite3 bcryptjs jsonwebtoken"
    fi
    
    # Check if bcryptjs is installed
    if [ -f "package.json" ] && grep -q "bcryptjs" package.json; then
        print_success "bcryptjs dependency found"
    else
        print_warning "bcryptjs not found in package.json"
        echo "Run: npm install bcryptjs"
    fi
    
    print_success "Requirements check complete!"
}

show_status() {
    print_header
    echo -e "${BLUE}Project Status:${NC}"
    echo ""
    
    # Database status
    if [ -f "$DB_FILE" ]; then
        DB_SIZE=$(du -h "$DB_FILE" | cut -f1)
        print_success "Database exists: $DB_FILE ($DB_SIZE)"
        
        # Count users
        USER_COUNT=$(node -e "
            const Database = require('better-sqlite3');
            const db = new Database('$DB_FILE');
            try {
                const result = db.prepare('SELECT COUNT(*) as count FROM users').get();
                console.log(result.count);
            } catch(e) {
                console.log('0');
            }
            db.close();
        " 2>/dev/null || echo "0")
        
        echo "   Users in database: $USER_COUNT"
    else
        print_warning "Database not found: $DB_FILE"
    fi
    
    # .env status
    if [ -f ".env" ]; then
        print_success ".env file exists"
    else
        print_warning ".env file not found"
    fi
    
    # Directory status
    for dir in "$DB_DIR" "$BACKUP_DIR" "./logs"; do
        if [ -d "$dir" ]; then
            print_success "Directory exists: $dir"
        else
            print_warning "Directory missing: $dir"
        fi
    done
    
    echo ""
    echo -e "${BLUE}Available commands:${NC}"
    echo "  ./script/init.sh init      - Initialize project"
    echo "  ./script/init.sh reset     - Reset project (removes all data)"
    echo "  ./script/init.sh check     - Check system requirements"
    echo "  ./script/init.sh status    - Show project status"
    echo "  ./script/auth.sh init      - Create default users"
    echo "  ./script/auth.sh list      - List all users"
}

show_help() {
    echo "Usage: $0 [OPTION]"
    echo "Initialize or manage the dashboard webserver project"
    echo ""
    echo "Options:"
    echo "  init     Initialize the project (default)"
    echo "  reset    Reset the project (removes all data)"
    echo "  check    Check system requirements"
    echo "  status   Show project status"
    echo "  help     Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0              # Initialize project"
    echo "  $0 init         # Initialize project"
    echo "  $0 reset        # Reset project with confirmation"
    echo "  $0 check        # Check Node.js, npm, and dependencies"
    echo "  $0 status       # Show current project status"
    echo ""
    echo "After initialization:"
    echo "  ./script/auth.sh init    # Create default users"
    echo "  npm run dev              # Start development server"
}

# Main script logic
case "${1:-init}" in
    "init")
        init_project
        ;;
    "reset")
        reset_project
        ;;
    "check")
        check_requirements
        ;;
    "status")
        show_status
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        print_error "Unknown option: $1"
        show_help
        exit 1
        ;;
esac