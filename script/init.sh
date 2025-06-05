# ./script/init.sh
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
        
        // Create users table
        db.exec(\`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'user',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            
            CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
            CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
        \`);
        
        console.log('Database schema initialized');
        db.close();
    "
    print_success "Database schema initialized"

    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        echo "Creating .env file..."
        cat >.env <<EOF
# Database Configuration
DATABASE_PATH=./db/sqlite.db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-$(date +%s)
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=development

# Logging
LOG_LEVEL=info
LOG_DIR=./logs
EOF
        print_success ".env file created"
    else
        print_warning ".env file already exists"
    fi

    print_success "Project initialization complete!"
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

show_help() {
    echo "Usage: $0 [OPTION]"
    echo "Initialize or reset the project"
    echo ""
    echo "Options:"
    echo "  init     Initialize the project (default)"
    echo "  reset    Reset the project (removes all data)"
    echo "  help     Show this help message"
}

# Main script logic
case "${1:-init}" in
"init")
    init_project
    ;;
"reset")
    reset_project
    ;;
"help" | "-h" | "--help")
    show_help
    ;;
*)
    print_error "Unknown option: $1"
    show_help
    exit 1
    ;;
esac
