# School CRUD System

A modern Node.js CRUD (Create, Read, Update, Delete) application with MySQL database integration. This system allows for user authentication, role-based access control, and product management.

## Features

- User authentication (login/register)
- Role-based access control (Admin and Student roles)
- Product management (CRUD operations)
- User management (CRUD operations for admins)
- Responsive UI with Bootstrap 5
- Security features (Helmet, session management, password hashing)

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository or download the source code

2. Navigate to the project directory
   ```
   cd crud-system
   ```

3. Install dependencies
   ```
   npm install
   ```

4. Configure the database
   - Create a MySQL database named `school_crud`
   - Import the database schema using the provided SQL file:
     ```
     mysql -u your_username -p school_crud < database_init.sql
     ```
   - Or run the SQL commands directly in your MySQL client

5. Configure environment variables
   - Rename `.env.example` to `.env` (if it exists) or create a new `.env` file
   - Update the database connection details and other settings in the `.env` file:
     ```
     # Database Configuration
     DB_HOST=localhost
     DB_USER=your_mysql_username
     DB_PASSWORD=your_mysql_password
     DB_NAME=school_crud

     # Server Configuration
     PORT=3000
     NODE_ENV=development

     # Session Secret
     SESSION_SECRET=your_session_secret_key
     ```

## Running the Application

1. Start the server in development mode
   ```
   npm run dev
   ```

2. Start the server in production mode
   ```
   npm start
   ```

3. Access the application in your browser
   ```
   http://localhost:3000
   ```

## Default Users

The application comes with two default users:

1. Admin User
   - Username: admin
   - Password: admin123
   - Role: admin

2. Student User
   - Username: student
   - Password: student123
   - Role: student

## Project Structure

```
crud-system/
├── config/             # Configuration files
│   └── db.js           # Database connection setup
├── middleware/         # Express middleware
│   ├── auth.js         # Authentication middleware
│   └── validators.js   # Input validation middleware
├── models/             # Data models
│   ├── Product.js      # Product model
│   └── User.js         # User model
├── public/             # Static files
│   └── css/            # CSS stylesheets
│       └── styles.css  # Custom styles
├── routes/             # Route handlers
│   ├── admin.js        # Admin routes
│   ├── auth.js         # Authentication routes
│   └── student.js      # Student routes
├── views/              # EJS templates
│   ├── layout.ejs      # Main layout template
│   ├── login.ejs       # Login page
│   ├── register.ejs    # Registration page
│   └── ...             # Other view templates
├── .env                # Environment variables
├── database_init.sql   # Database initialization script
├── package.json        # Project dependencies
├── README.md           # Project documentation
└── server.js           # Application entry point
```

## License

This project is licensed under the MIT License.