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
    
    echo "Creating default users with encrypted passwords..."
    
    # Create users using Node.js script with proper password encryption
    node -e "
        const Database = require('better-sqlite3');
        const bcrypt = require('bcryptjs');
        
        const db = new Database('$DB_FILE');
        
        // Password utility class matching your implementation
        class PasswordUtils {
            static SALT_ROUNDS = 12;
            
            static async hashPassword(password) {
                try {
                    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
                    const hashedPassword = await bcrypt.hash(password, salt);
                    return hashedPassword;
                } catch (error) {
                    console.error('Password hashing error:', error);
                    throw new Error('Failed to hash password');
                }
            }
        }
        
        async function createUsers() {
            try {
                // Engineer user
                const engineerPassword = 'engineerpassword';
                const hashedEngineerPassword = await PasswordUtils.hashPassword(engineerPassword);
                
                const engineer = db.prepare(\`
                    INSERT OR REPLACE INTO users (username, password, role, created_at, updated_at)
                    VALUES (?, ?, ?, datetime('now'), datetime('now'))
                \`);
                engineer.run('engineer', hashedEngineerPassword, 'engineer');
                console.log('✅ Engineer user created');
                
                // Maintainer user
                const maintainerPassword = 'maintainerpassword';
                const hashedMaintainerPassword = await PasswordUtils.hashPassword(maintainerPassword);
                
                const maintainer = db.prepare(\`
                    INSERT OR REPLACE INTO users (username, password, role, created_at, updated_at)
                    VALUES (?, ?, ?, datetime('now'), datetime('now'))
                \`);
                maintainer.run('maintainer', hashedMaintainerPassword, 'maintainer');
                console.log('✅ Maintainer user created');
                
                console.log('');
                console.log('🎉 Default users created successfully!');
                console.log('');
                console.log('Login credentials:');
                console.log('=================');
                console.log('Engineer:');
                console.log('  Username: engineer');
                console.log('  Password: engineerpassword');
                console.log('  Role: engineer');
                console.log('');
                console.log('Maintainer:');
                console.log('  Username: maintainer');
                console.log('  Password: maintainerpassword');
                console.log('  Role: maintainer');
                console.log('');
                console.log('🔐 Passwords are encrypted using bcrypt with 12 salt rounds');
                console.log('⚠️  Please change these default passwords in production!');
                
            } catch (error) {
                console.error('❌ Error creating users:', error.message);
                process.exit(1);
            } finally {
                db.close();
            }
        }
        
        createUsers();
    "
    
    print_success "Default users initialized with encrypted passwords!"
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
            const users = db.prepare('SELECT id, username, role, created_at FROM users ORDER BY id').all();
            
            if (users.length === 0) {
                console.log('No users found in database.');
                console.log('Run \"./script/auth.sh init\" to create default users.');
            } else {
                console.log('');
                console.log('ID | Username   | Role       | Created    | Password Status');
                console.log('---|------------|------------|------------|----------------');
                users.forEach(user => {
                    const createdDate = new Date(user.created_at).toISOString().split('T')[0];
                    const passwordStatus = 'Encrypted (bcrypt)';
                    console.log(\`\${user.id.toString().padEnd(2)} | \${user.username.padEnd(10)} | \${user.role.padEnd(10)} | \${createdDate} | \${passwordStatus}\`);
                });
                console.log('');
                console.log(\`Total users: \${users.length}\`);
                console.log('');
                console.log('🔐 All passwords are encrypted using bcrypt with 12 salt rounds');
            }
        } catch (error) {
            console.error('❌ Error listing users:', error.message);
            process.exit(1);
        } finally {
            db.close();
        }
    "
}

test_login() {
    print_header
    echo -e "${BLUE}Testing user login functionality...${NC}"
    
    check_database
    
    # Test if the server is running
    if ! curl -s http://localhost:3000/health > /dev/null; then
        print_warning "Server is not running on localhost:3000"
        print_warning "Start the server with 'npm run dev' to test login"
        return 1
    fi
    
    echo "Testing engineer login..."
    
    # Test engineer login
    ENGINEER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
        -H "Content-Type: application/json" \
        -d '{"username": "engineer", "password": "engineerpassword"}')
    
    if echo "$ENGINEER_RESPONSE" | grep -q "token"; then
        print_success "Engineer login test passed"
        echo "Response: $ENGINEER_RESPONSE"
    else
        print_error "Engineer login test failed"
        echo "Response: $ENGINEER_RESPONSE"
    fi
    
    echo ""
    echo "Testing maintainer login..."
    
    # Test maintainer login
    MAINTAINER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
        -H "Content-Type: application/json" \
        -d '{"username": "maintainer", "password": "maintainerpassword"}')
    
    if echo "$MAINTAINER_RESPONSE" | grep -q "token"; then
        print_success "Maintainer login test passed"
        echo "Response: $MAINTAINER_RESPONSE"
    else
        print_error "Maintainer login test failed"
        echo "Response: $MAINTAINER_RESPONSE"
    fi
}

show_help() {
    echo "Usage: $0 [OPTION]"
    echo "Manage authentication users with encrypted passwords"
    echo ""
    echo "Options:"
    echo "  init     Initialize default users (engineer, maintainer)"
    echo "  reset    Reset all users and reinitialize defaults"
    echo "  list     List all users in database"
    echo "  test     Test login functionality (requires server running)"
    echo "  help     Show this help message"
    echo ""
    echo "Default Users:"
    echo "  engineer   - engineerpassword (role: engineer)"
    echo "  maintainer - maintainerpassword (role: maintainer)"
    echo ""
    echo "Security:"
    echo "  All passwords are encrypted using bcrypt with 12 salt rounds"
    echo "  Change default passwords in production!"
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
    "test")
        test_login
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