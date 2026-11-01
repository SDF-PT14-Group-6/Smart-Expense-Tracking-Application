# SmartExpense — Smart Expense Tracking Application

SmartExpense is a full-stack personal finance management application designed to help users record, organize, track, and analyse their income and expenses. The application provides an intuitive interface for managing financial transactions, monitoring account balances, reviewing spending patterns, and accessing financial summaries through an interactive dashboard.

Built using **React, Vite, Python, Flask, and SQLAlchemy**, SmartExpense follows a client-server architecture that separates the frontend interface from backend business logic and database operations.

The project demonstrates the application of modern software engineering practices, including collaborative development, feature-based branching, pull requests, version control, API integration, database migrations, testing, and deployment.

**Live Demo:**
https://smart-expense-tracking-application-ld8s-jwnrh7gv5.vercel.app/

**Group GitHub Repository:**
https://github.com/SDF-PT14-Group-6/Smart-Expense-Tracking-Application

---

## Table of Contents

1. [Project Objectives](#project-objectives)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Application Features](#application-features)
5. [Current Implementation Status](#current-implementation-status)
6. [Project Structure](#project-structure)
7. [Prerequisites](#prerequisites)
8. [Installation and Setup](#installation-and-setup)
9. [Running the Application](#running-the-application)
10. [Database and Migrations](#database-and-migrations)
11. [Testing](#testing)
12. [Git Collaboration Workflow](#git-collaboration-workflow)
13. [Security Considerations](#security-considerations)
14. [Future Development](#future-development)
15. [Team Contributions](#team-contributions)
16. [Repository and Deployment Links](#repository-and-deployment-links)

## Project Objectives

The main objectives of SmartExpense are to:

- Provide a centralized platform for managing personal financial records.
- Enable users to record and monitor both income and expenses.
- Calculate and display income, expenditure, and available balances.
- Provide an interactive dashboard for financial monitoring.
- Support creating, viewing, editing, and deleting financial transactions.
- Help users organize transactions through categories and filters.
- Establish a maintainable and scalable frontend and backend architecture.
- Apply software engineering practices, including version control, collaborative development, database management, and automated testing.

## Technology Stack

### Frontend

- React.js – Building interactive user interfaces.
- Vite – Frontend development and build tooling.
- JavaScript – Application functionality.
- HTML5 and CSS3 – Structure and styling.
- Lucide React – Interface icons.
- Fetch API – Communication with the backend REST API.

### Backend

- Python – Backend programming language.
- Flask – REST API development.
- Flask-CORS – Cross-origin resource sharing.
- Flask-SQLAlchemy – Database integration and ORM.
- Flask-Migrate – Database migration management.
- PyJWT – Token-based authentication.
- Gunicorn – Production application server.

### Database

- SQLAlchemy ORM – Database modelling and operations.
- SQLite – Local development database by default.
- PostgreSQL – Supported through database configuration.

### Development and Deployment

- Git and GitHub – Version control and collaboration.
- Feature branches and pull requests – Collaborative development workflow.
- Vercel – Frontend hosting.
- Render – Backend hosting.
- ESLint – JavaScript code quality checks.
- Pytest – Backend automated testing.
- Vite – Production frontend builds.

## System Architecture

SmartExpense follows a client-server architecture consisting of the following components:

1. **React Frontend:** Provides the user interface for registration, authentication, dashboard monitoring, and financial transaction management.
2. **Flask REST API:** Processes authentication requests and financial transaction operations.
3. **SQLAlchemy ORM:** Manages database models and communication between the backend and database.
4. **Database:** Stores user information and financial transaction records using the configured database connection.
5. **Deployment Infrastructure:** Vercel hosts the frontend, while Render hosts the Flask backend.

The frontend communicates with the backend through HTTP requests. The backend API address is configured through the `VITE_API_URL` environment variable.

## Application Features

### 1. User Authentication

- User registration.
- User login.
- Backend authentication integration.
- Token-based authentication using JWT.

### 2. Financial Dashboard

- Total income summary.
- Total expenses summary.
- Available balance calculation.
- Financial overview cards.
- Transaction summaries for monitoring financial activity.

### 3. Income and Expense Management

- Add income transactions.
- Record expenses.
- View transaction records.
- Edit existing transactions.
- Delete transactions.
- Record transaction descriptions and relevant details.
- Support payment methods and transaction notes.

### 4. Transaction Organization

- Categorize financial transactions.
- Search transaction records.
- Filter transactions by category and transaction type.
- Organize and review financial activities.

### 5. Financial Reports

- Display financial summaries.
- Review spending information.
- Present transaction statistics and financial insights.

### 6. User Interface

- React-based application pages and reusable components.
- Dashboard overview.
- Responsive interface styling.
- Navigation between application sections.
- Interactive transaction management.

*Feature availability in the hosted application depends on the deployed frontend version and backend configuration.*

## Current Implementation Status

The project has progressed from the initial frontend setup to a full-stack application integrating a React frontend with a Flask REST API.

The implementation includes:

- React and Vite frontend development.
- Flask REST API foundation.
- SQLAlchemy database models.
- Flask-Migrate database migration support.
- Authentication and transaction API development.
- Integration of the React frontend with the Flask backend.
- Dashboard and financial summary components.
- Income and expense transaction management.
- Transaction editing and deletion.
- Search and filtering functionality.
- Gunicorn configuration for production hosting.
- Frontend deployment through Vercel.
- Backend deployment through Render.
- Frontend linting and production build verification.
- Automated backend testing using Pytest.

The deployed backend health endpoint is:

https://smart-expense-tracking-application.onrender.com/api/health

A successful response confirms that the Flask API is running.

## Project Structure

The project is organized into separate frontend and backend directories.

```text
Smart-Expense-Tracking-Application/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   └── flask_api/
│       ├── app/
│       ├── migrations/
│       │   └── versions/
│       ├── tests/
│       ├── config.py
│       ├── Pipfile
│       ├── requirements.txt
│       └── run.py
│
└── README.md
```

## Prerequisites

Ensure the following tools are installed:

- Git
- Node.js and npm
- Python 3.11
- Pipenv
- Visual Studio Code or another code editor

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/SDF-PT14-Group-6/Smart-Expense-Tracking-Application.git

cd Smart-Expense-Tracking-Application
```

### 2. Install frontend dependencies

Navigate to the client directory:

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory for local development:

```env
VITE_API_URL=http://127.0.0.1:5000
```

### 3. Install backend dependencies

Navigate to the Flask backend directory:

```bash
cd ../server/flask_api
```

Install Pipenv if it is not already installed:

```bash
python3 -m pip install --user pipenv
```

Install the project dependencies:

```bash
pipenv install
```

Alternatively, install the dependencies from `requirements.txt` using a Python virtual environment:

```bash
python3 -m venv venv

source venv/bin/activate

pip install -r requirements.txt
```

### 4. Configure environment variables

Configure the required backend environment variables according to the application configuration.

Use a strong production `SECRET_KEY` and the appropriate database connection string.

Do not commit passwords, secret keys, database credentials, or `.env` files to GitHub.

## Running the Application

The frontend and backend should run in separate terminal windows.

### Running the Frontend

From the `client` directory:

```bash
npm run dev
```

Vite will display the local development address, usually:

http://localhost:5173/

Open the displayed address in your browser.

### Running the Flask Backend

From the `server/flask_api` directory:

```bash
pipenv run python run.py
```

The backend commonly runs at:

http://127.0.0.1:5000

Check the backend health endpoint:

http://127.0.0.1:5000/api/health

For production deployment, the configured Gunicorn command is:

```bash
gunicorn run:app
```

## Database and Migrations

SmartExpense uses SQLAlchemy for database interaction and Flask-Migrate for managing database schema changes.

The application supports SQLite for local development and PostgreSQL through the configured database connection.

Database migrations help maintain consistency between database models and the database schema as the application evolves.

When database models change:

- Create the appropriate migration.
- Review the generated migration file.
- Apply the migration to the intended database.
- Verify that the application continues to operate correctly.

Production database credentials should be supplied through environment variables rather than stored in source code.

## Testing

Testing is an important part of verifying the application's functionality and reliability.

### Backend Testing

The backend uses Pytest for automated testing.

Run the backend tests from `server/flask_api`:

```bash
pipenv run python -m pytest -q
```

**Verified result: 19 tests passed.**

### Frontend Code Quality

From the `client` directory, run:

```bash
npm run lint
```

### Frontend Production Build

Run:

```bash
npm run build
```

### Functional Testing

The following application functions have also been tested:

- Adding income transactions.
- Adding expense transactions.
- Editing existing transactions.
- Deleting transactions.
- Viewing financial summaries.
- Checking frontend and backend communication.

### Deployment Verification

The backend health endpoint was checked successfully and returned HTTP 200 with the API status set to `ok`.

Frontend deployment accessibility should also be verified before final public assessment.

## Git Collaboration Workflow

The team uses Git and GitHub to manage collaborative development and source code changes.

The development workflow follows these steps:

1. Update the shared development branch.
2. Create a feature branch for the assigned task.
3. Implement the required changes.
4. Test the implementation locally.
5. Commit changes using meaningful commit messages.
6. Push the feature branch to GitHub.
7. Create a pull request against the development branch.
8. Review changes and resolve merge conflicts.
9. Merge approved changes after the required checks pass.
10. Integrate reviewed work into the main branch for final submission.

Example commands for updating the shared development branch:

```bash
git switch dev
git pull upstream dev
```

Create a feature branch:

```bash
git switch -c feature/your-feature-name
```

After making and testing changes:

```bash
git add <files-you-changed>

git commit -m "Describe the change clearly"

git push -u origin feature/your-feature-name
```

Always review `git status` before committing to ensure that unrelated files, temporary backups, and sensitive information are not included.

## Security Considerations

The application incorporates security practices intended to protect user accounts and financial records.

These include:

- Keeping secret keys and credentials out of source control.
- Using environment variables for deployment configuration.
- Protecting authenticated endpoints with appropriate authentication checks.
- Validating incoming data on the backend.
- Restricting access to records according to user authorization.
- Using HTTPS for production communication.
- Handling passwords securely rather than storing them in plaintext.
- Configuring database access appropriately.
- Reviewing dependencies and deployment logs.

## Future Development

Potential areas for further improvement include:

- More advanced financial reports and visualizations.
- Budget creation and spending alerts.
- Exportable financial reports.
- Improved automated frontend testing.
- Additional accessibility enhancements.
- More detailed financial analytics.
- Further improvements to responsive design and user experience.

These are proposed enhancements and are not presented as completed functionality.

## Team Contributions

SmartExpense was developed collaboratively, with team members contributing to frontend development, application pages, dashboard implementation, transaction management, backend API development, database integration, and deployment.

| Team member | Contribution |
|---|---|
| Maureen Wanjira (123Mwanjira) | React and Vite frontend development, landing page, frontend styling, Flask API integration, testing, and deployment support |
| Joshua Magolo | Application pages and authentication-related frontend work |
| Bernard Marangu | Dashboard components, styling, and integration work |
| Fatuhdin Ibrahim Ali | Transaction and expense-management features |Flask authentication and transaction API development, backend cleanup, and integration support |

This summary highlights the main areas of contribution. The repository's commit history and pull requests provide a more detailed record of collaborative development.

## Repository and Deployment Links

**Group GitHub Repository:**
https://github.com/SDF-PT14-Group-6/Smart-Expense-Tracking-Application

**Live Frontend:**
https://smart-expense-tracking-application-ld8s-jwnrh7gv5.vercel.app/

**Backend Health Check:**
https://smart-expense-tracking-application.onrender.com/api/health

---

*SmartExpense — Simplifying personal financial management through technology.*