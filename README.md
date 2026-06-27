# E-Commerce Platform API

This is the backend API for the E-Commerce Platform, built using Express, Node.js, and Sequelize (with MySQL).

## Prerequisites

Before setting up the project, make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MySQL Server](https://www.mysql.com/)

---

## Installation & Setup

Follow these steps to set up and run the project locally:

### 1. Install Dependencies
Run the following command in the project root directory:
```bash
npm install
```

### 2. Configure Environment Variables
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Open the `.env` file and fill in your database credentials and configurations:
```env
NODE_ENV=development
PORT=5000
JWT_SECRET=your_jwt_secret_here

DB_DIALECT=mysql
DB_NAME=ecom
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
```

### 3. Create the Database
Ensure your MySQL server is running, and create the database specified in your `.env` (default is `ecom`):
```sql
CREATE DATABASE ecom;
```

### 4. Run Database Migrations
Run the migrations to create the required database tables (`users` and `addresses`):
```bash
npm run db:migrate
```

*Note: If you ever need to rollback the last migration, you can run:*
```bash
npm run db:migrate:undo
```

---

## Running the Application

### Development Mode (with hot-reloading)
To start the server in development mode, run:
```bash
npm run dev
```

### Production Mode
To start the server in production mode, run:
```bash
npm start
```

On initial startup, the system will automatically seed a default admin user if one does not already exist:
- **Email:** `admin@ecom.com`
- **Password:** `Admin@123`