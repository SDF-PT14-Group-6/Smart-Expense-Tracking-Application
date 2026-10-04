# SmartExpense — Smart Expense Tracking Application

SmartExpense is a full-stack personal finance application designed to help users manage their income and expenses, monitor their financial position, and understand their spending patterns.

The application provides a simple and user-friendly platform where users can securely manage their financial transactions and access meaningful financial information through a dashboard.

---

## Project Overview

Managing personal finances can be difficult when income and expenses are recorded manually or scattered across different platforms.

SmartExpense aims to provide a centralized digital solution that enables users to:

* Record income and expenses
* Track their current financial balance
* Categorize transactions
* View spending patterns
* Search and filter transactions
* Manage their financial records securely
* Access their information through a responsive web application

The project is being developed as a collaborative full-stack application using modern web development technologies.

---

## Project Goals

The main goals of SmartExpense are to:

1. Provide an easy-to-use personal finance management platform.
2. Allow users to securely manage their financial transactions.
3. Provide a clear dashboard for understanding financial performance.
4. Support transaction search and filtering.
5. Protect user information through authentication and authorization.
6. Demonstrate practical full-stack software engineering skills.
7. Apply collaborative Git and GitHub development practices.

---

## Technology Stack

### Frontend

* React.js
* Vite
* JavaScript
* HTML5
* CSS3

### Backend

* Node.js
* Express.js
* REST API

### Authentication & Security

* JWT authentication
* bcrypt password hashing
* CORS
* Environment variables using dotenv

### Database

The project database layer is currently being finalized by the team. The application architecture is designed so that the React frontend communicates with the Express backend, while the backend manages communication with the selected database.

---

## System Architecture

```text
                    SMARTEXPENSE

                        USER
                          |
                          v
                +-------------------+
                |   React Frontend  |
                |       Vite        |
                +-------------------+
                          |
                          | HTTP / REST API
                          v
                +-------------------+
                |  Express Backend  |
                |    Node.js API    |
                +-------------------+
                          |
                          v
                +-------------------+
                |      Database     |
                +-------------------+
```

The frontend does not communicate directly with the database.

Instead:

**React → Express REST API → Database**

This separation improves maintainability, security and scalability.

---

# Key Features

## 1. User Authentication

The application is designed to provide secure user authentication, including:

* User registration
* User login
* Password protection
* JWT-based authentication
* User authorization
* Protected user resources

---

## 2. Financial Dashboard

The dashboard will provide users with an overview of their financial position, including:

* Total income
* Total expenses
* Current balance
* Spending by category
* Recent transactions
* Financial summaries

The dashboard is intended to make financial information easier to understand at a glance.

---

## 3. Transaction Management

Users will be able to manage their financial transactions.

Planned transaction functionality includes:

* Add income
* Add expenses
* View transactions
* Edit transactions
* Delete transactions
* Categorize transactions
* Search transactions
* Filter transactions by category
* Filter transactions by date

---

## 4. User Data Protection

Each authenticated user should only be able to access and manage their own financial records.

The backend will enforce authorization so that one user cannot access another user's transactions.

Security considerations include:

* Password hashing using bcrypt
* JWT authentication
* Protected API routes
* Environment variables for sensitive configuration
* Server-side validation
* User-specific data access

---

# REST API

The backend is being developed using Express.js.

Planned API endpoints include:

### Authentication

```text
POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/me
```

### Transactions

```text
GET    /api/transactions
POST   /api/transactions
GET    /api/transactions/:id
PATCH  /api/transactions/:id
DELETE /api/transactions/:id
```

The API will act as the communication layer between the React frontend and the database.

---

# Current Project Structure

The project separates the frontend and backend into their own directories:

```text
Smart-Expense-Tracking-Application/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   └── server.js
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md
```

---

# Current Development Progress

### Frontend

The initial SmartExpense landing page has been implemented.

Current frontend work includes:

* SmartExpense branding
* Project introduction
* Login button
* Create Account button
* Responsive-friendly layout
* Initial styling

The frontend was tested successfully using:

```bash
npm run build
```

The application was also tested locally using the Vite development server.

---

### Backend

The initial Express backend foundation has been implemented.

Current backend work includes:

* Express server setup
* CORS configuration
* JSON request handling
* Environment variable support
* Initial API health route

The initial API endpoint is:

```text
GET /
```

It returns:

```json
{
  "message": "Smart Expense Tracking API is running"
}
```

The backend currently runs on port:

```text
5555
```

---

# Running the Project Locally

## Prerequisites

Make sure you have installed:

* Git
* Node.js
* npm
* VS Code or another code editor

---

## Clone the Repository

```bash
git clone https://github.com/SDF-PT14-Group-6/Smart-Expense-Tracking-Application.git
```

Move into the project:

```bash
cd Smart-Expense-Tracking-Application
```

---

# Running the Frontend

Move into the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will provide a local development URL, normally similar to:

```text
http://localhost:5173
```

---

# Running the Backend

Open another terminal and move into the server directory:

```bash
cd Smart-Expense-Tracking-Application/server
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
node src/server.js
```

The backend should run on:

```text
http://localhost:5555
```

Test the API:

```bash
curl http://localhost:5555/
```

Expected response:

```json
{
  "message": "Smart Expense Tracking API is running"
}
```

---

# GitHub Collaboration Workflow

SmartExpense is being developed collaboratively using Git and GitHub.

The team follows a feature-branch workflow:

```text
              shared dev
                  |
        +---------+---------+
        |         |         |
        v         v         v
    feature/   feature/   feature/
      member      member      member
        |         |         |
        v         v         v
     commits   commits   commits
        |         |         |
        +---------+---------+
                  |
                  v
             Pull Request
                  |
                  v
               Review
                  |
                  v
             Merge into dev
```

### Team Workflow

Each contributor should:

1. Start from the latest `dev` branch.
2. Create a feature branch.
3. Work on the assigned feature.
4. Make meaningful commits.
5. Push the feature branch to GitHub.
6. Create a Pull Request.
7. Have the work reviewed.
8. Merge the approved Pull Request into `dev`.

Contributors should avoid making changes directly on the shared `dev` branch.

---

# Example Feature Branches

Examples include:

```text
feature/auth-pages
feature/dashboard
feature/transactions
feature/api-integration
feature/navigation
feature/financial-reports
```

Branch names should clearly describe the feature being developed.

---

# Git Commit Practices

The team aims to maintain meaningful Git history.

Examples of good commit messages include:

```text
Create SmartExpense landing page
Set up Express backend foundation
Add authentication form
Implement transaction creation form
Add transaction dashboard
Add transaction filtering
Connect frontend to transactions API
```

Meaningful incremental commits make it easier to understand the development process and identify individual contributions.

---

# Testing

Testing is performed throughout development.

Current checks include:

### Frontend build

```bash
npm run build
```

### Backend API test

```bash
curl http://localhost:5555/
```

As development continues, additional testing will cover:

* Authentication
* API endpoints
* Transaction CRUD operations
* Authorization
* Form validation
* User-specific data access
* Frontend functionality

---

# Security Considerations

Security is an important part of SmartExpense because the application handles personal financial information.

Planned security measures include:

* Password hashing with bcrypt
* JWT authentication
* Protected API routes
* Authorization checks
* Environment variables for sensitive configuration
* CORS configuration
* Input validation
* User-specific transaction access
* Avoiding sensitive information in Git commits

Environment files containing secrets should never be committed to GitHub.

---

# Project Development Status

| Component                  | Status                 |
| -------------------------- | ---------------------- |
| React/Vite frontend        | In development         |
| SmartExpense landing page  | Completed              |
| Express backend foundation | Completed              |
| Backend health endpoint    | Completed              |
| Authentication             | In development         |
| Database integration       | In development         |
| Transaction CRUD           | Planned/In development |
| Dashboard                  | In development         |
| Search and filtering       | Planned/In development |
| API integration            | In development         |
| Testing                    | Ongoing                |
| Deployment                 | Planned                |

---

# Future Improvements

Future versions of SmartExpense may include:

* Financial charts and visualizations
* Advanced spending analytics
* Monthly financial reports
* Budget management
* Savings goals
* Recurring transactions
* Exportable financial reports
* Currency conversion where required
* Improved mobile responsiveness
* Deployment to a production environment
* Additional security and validation features

---

# Team Collaboration

This project is being developed as a collaborative software engineering project.

Team members contribute through:

* Feature branches
* Meaningful commits
* Pull Requests
* Code reviews
* Testing
* Documentation
* Integration of approved features

This approach allows the team to work on different parts of the application while maintaining a clean and traceable Git history.

---

# Learning Outcomes

Through the development of SmartExpense, the team is applying practical skills in:

* React development
* JavaScript
* Node.js
* Express.js
* REST API development
* Authentication
* Database integration
* Git and GitHub
* Collaborative software development
* Debugging and testing
* Software architecture
* Application security
* Technical documentation

---

# Repository

**GitHub Repository:**

https://github.com/SDF-PT14-Group-6/Smart-Expense-Tracking-Application

---

# Project Status

**SmartExpense is currently under active development.**

The initial frontend structure and backend foundation have been established, and the team is continuing development of authentication, database integration, transaction management, dashboard functionality and API integration.

---

## License

This project was developed as part of a collaborative software engineering capstone project.
