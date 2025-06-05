# ./script/auth.sh
#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DB_DIR="./db"
DB_FILE="$DB_DIR/sqlite.db"

print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}       User Management System${NC}"
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

check_database() {
    if [ ! -f "$DB_FILE" ]; then
        print_error "Database not found! Please run './script/init.sh' first."
        exit 1
    fi
}

init_users() {
    print_header
    echo -e "${BLUE}Initializing default users...${NC}"

    check_database

    # Generate secret key for passwords
    SECRET_KEY=$(openssl rand -hex 16)

    echo "Creating default users with secret key: $SECRET_KEY"

    # Create users using Node.js script
    node -e "
        const Database = require('better-sqlite3');
        const bcrypt = require('bcryptjs');
        
        const db = new Database('$DB_FILE');
        const secretKey = '$SECRET_KEY';
        
        async function createUsers() {
            try {
                // Engineer user
                const engineerPassword = await bcrypt.hash(secretKey + 'engineer', 12);
                const engineer = db.prepare(\`
                    INSERT OR REPLACE INTO users (username, email, password, role, created_at, updated_at)
                    VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
                \`);
                engineer.run('engineer', 'engineer@company.com', engineerPassword, 'engineer');
                console.log('✅ Engineer user created');
                
                // Maintainer user
                const maintainerPassword = await bcrypt.hash(secretKey + 'maintainer', 12);
                const maintainer = db.prepare(\`
                    INSERT OR REPLACE INTO users (username, email, password, role, created_at, updated_at)
                    VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
                \`);
                maintainer.run('maintainer', 'maintainer@company.com', maintainerPassword, 'maintainer');
                console.log('✅ Maintainer user created');
                
                console.log('');
                console.log('Default users created successfully!');
                console.log('');
                console.log('Login credentials:');
                console.log('=================');
                console.log('Engineer:');
                console.log('  Username: engineer');
                console.log('  Email: engineer@company.com');
                console.log('  Password: ' + secretKey + 'engineer');
                console.log('');
                console.log('Maintainer:');
                console.log('  Username: maintainer');
                console.log('  Email: maintainer@company.com');
                console.log('  Password: ' + secretKey + 'maintainer');
                console.log('');
                console.log('🔐 Secret key: ' + secretKey);
                
            } catch (error) {
                console.error('❌ Error creating users:', error.message);
                process.exit(1);
            } finally {
                db.close();
            }
        }
        
        createUsers();
    "

    print_success "Default users initialized!"
}

reset_users() {
    print_header
    echo -e "${YELLOW}Resetting all users...${NC}"

    check_database

    read -p "Are you sure you want to reset all users? This will delete all user data! (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Reset cancelled."
        exit 0
    fi

    # Clear users table
    node -e "
        const Database = require('better-sqlite3');
        const db = new Database('$DB_FILE');
        
        try {
            db.exec('DELETE FROM users');
            console.log('✅ All users removed');
        } catch (error) {
            console.error('❌ Error removing users:', error.message);
            process.exit(1);
        } finally {
            db.close();
        }
    "

    print_success "Users table cleared!"

    # Reinitialize default users
    init_users
}

list_users() {
    print_header
    echo -e "${BLUE}Current users in database:${NC}"

    check_database

    node -e "
        const Database = require('better-sqlite3');
        const db = new Database('$DB_FILE');
        
        try {
            const users = db.prepare('SELECT id, username, email, role, created_at FROM users ORDER BY id').all();
            
            if (users.length === 0) {
                console.log('No users found in database.');
            } else {
                console.log('');
                console.log('ID | Username   | Email                  | Role       | Created');
                console.log('---|------------|------------------------|------------|----------');
                users.forEach(user => {
                    const createdDate = new Date(user.created_at).toISOString().split('T')[0];
                    console.log(\`\${user.id.toString().padEnd(2)} | \${user.username.padEnd(10)} | \${user.email.padEnd(22)} | \${user.role.padEnd(10)} | \${createdDate}\`);
                });
                console.log('');
                console.log(\`Total users: \${users.length}\`);
            }
        } catch (error) {
            console.error('❌ Error listing users:', error.message);
            process.exit(1);
        } finally {
            db.close();
        }
    "
}

show_help() {
    echo "Usage: $0 [OPTION]"
    echo "Manage authentication users"
    echo ""
    echo "Options:"
    echo "  init     Initialize default users (engineer, maintainer)"
    echo "  reset    Reset all users and reinitialize defaults"
    echo "  list     List all users in database"
    echo "  help     Show this help message"
}

# Main script logic
case "${1:-init}" in
"init")
    init_users
    ;;
"reset")
    reset_users
    ;;
"list")
    list_users
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
