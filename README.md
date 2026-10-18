# SmartExpense — Smart Expense Tracking Application

SmartExpense is a full-stack personal finance application designed to help users record, organize, and monitor their income and expenses. It provides a user-friendly interface for managing financial transactions, viewing financial summaries, and understanding spending patterns through a dashboard.

The application combines a React frontend with a Flask REST API and a SQLAlchemy database layer. It is being developed collaboratively as part of a software engineering assignment, using feature branches, pull requests, code reviews, and version control.

**Live Demo:** https://smart-expense-tracking-application-ld8s-jwnrh7gv5.vercel.app/

**Group Repository:** https://github.com/SDF-PT14-Group-6/Smart-Expense-Tracking-Application

## Table of Contents

- [Project Objectives](#project-objectives)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Application Features](#application-features)
- [Current Implementation Status](#current-implementation-status)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Running the Frontend](#running-the-frontend)
- [Running the Flask Backend](#running-the-flask-backend)
- [Database and Migrations](#database-and-migrations)
- [Testing](#testing)
- [Git Collaboration Workflow](#git-collaboration-workflow)
- [Security Considerations](#security-considerations)
- [Future Development](#future-development)
- [Team Contributions](#team-contributions)
- [Repository](#repository)

## Project Objectives

The objectives of SmartExpense are to:

- Provide an organized interface for managing personal financial records.
- Help users monitor income, expenses, and balances.
- Present financial summaries through a dashboard.
- Support creating, viewing, editing, and deleting expense records.
- Establish a maintainable frontend and backend architecture.
- Apply software engineering practices, including testing, migrations, version control, and collaborative code review.

## Technology Stack

### Frontend

- React.js
- Vite
- JavaScript
- HTML5 and CSS3
- Lucide React icons
- Fetch API for backend communication

### Backend

- Python
- Flask
- Flask-CORS
- Flask-SQLAlchemy
- Flask-Migrate
- PyJWT
- Gunicorn

### Database

- SQLAlchemy ORM
- SQLite for local development by default
- PostgreSQL support through database configuration

### Development and Deployment

- Git and GitHub
- Feature branches and pull requests
- Vercel for frontend deployment
- Render for backend deployment
- ESLint and Vite build tools

## System Architecture

SmartExpense uses a client-server architecture:

1. **React frontend:** Provides the interface for authentication, dashboard summaries, and expense management.
2. **Flask REST API:** Handles authentication and financial transaction requests.
3. **SQLAlchemy:** Provides database models and database access.
4. **Database:** Stores application records using the configured database connection.
5. **Deployment:** Vercel hosts the frontend, while Render hosts the Flask backend.

The frontend communicates with the backend through HTTP requests. The frontend API base URL is configured using the `VITE_API_URL` environment variable.

## Application Features

### Authentication

- User registration.
- User login.
- Authentication integration with the backend.
- Token-based authentication support.

### Dashboard

- Income, expense, and balance summaries.
- Financial overview cards.
- Transaction information for monitoring spending.

### Expense Management

- Create expense records.
- View transactions.
- Edit existing expense records.
- Delete expense records.
- Review and organize spending information.

### User Interface

- React-based application pages and components.
- Responsive styling.
- Reusable dashboard components.
- Navigation between relevant application views.

*Feature availability may depend on the deployed version and backend configuration.*

## Current Implementation Status

Development work includes:

- React and Vite frontend setup.
- Flask REST API foundation.
- SQLAlchemy models and database migration setup.
- Authentication and transaction API development.
- Removal of the obsolete Express backend starter.
- React frontend integration with the Flask API.
- Gunicorn configuration for production deployment.
- Dashboard and transaction interface updates.
- Frontend deployment to Vercel.
- Backend deployment to Render.

The deployed Flask health endpoint is:

https://smart-expense-tracking-application.onrender.com/api/health

It can be used to check whether the API is responding.

## Project Structure

The repository contains frontend and backend components. The exact structure may evolve during development.

```text
Smart-Expense-Tracking-Application/
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
├── server/
│   └── flask_api/
│       ├── app/
│       ├── migrations/
│       ├── requirements.txt
│       └── run.py
└── README.md
```

## Prerequisites

Install the following before running the application locally:

- Git
- Node.js and npm
- Python
- pip
- Visual Studio Code or another code editor

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/SDF-PT14-Group-6/Smart-Expense-Tracking-Application.git
cd Smart-Expense-Tracking-Application
```

### 2. Set up the frontend

```bash
cd client
npm install
```

For local development, configure the frontend environment variable as appropriate:

```env
VITE_API_URL=http://127.0.0.1:5000
```

### 3. Set up the Flask backend

From the repository root:

```bash
cd server/flask_api
python -m venv venv
```

Activate the virtual environment on Ubuntu or WSL:

```bash
source venv/bin/activate
```

Install backend dependencies:

```bash
pip install -r requirements.txt
```

Configure required environment variables according to the backend configuration. Use a secure `SECRET_KEY` and the appropriate database connection string where required. Do not commit secrets or `.env` files to GitHub.

## Running the Frontend

From the `client` directory, run:

```bash
npm run dev
```

Vite will display the development URL in the terminal, usually:

http://localhost:5173

Open the displayed URL in your browser.

## Running the Flask Backend

From `server/flask_api`, activate the virtual environment and run:

```bash
python run.py
```

The API commonly runs at:

http://127.0.0.1:5000

Check the health endpoint at:

http://127.0.0.1:5000/api/health

For production deployment, the configured Gunicorn command is:

```bash
gunicorn run:app
```

## Database and Migrations

The application uses SQLAlchemy for database interaction and Flask-Migrate for database migrations.

Database configuration should be supplied through environment variables where appropriate. Local development may use SQLite, while PostgreSQL can be configured for a hosted environment.

When database models change, create and apply migrations using the commands supported by the Flask application configuration. Review migration files before applying them to a production database.

Do not store production database credentials in source code.

## Testing

Recommended verification before merging includes:

- Installing frontend dependencies successfully.
- Running the frontend development server.
- Running ESLint and resolving reported issues.
- Running the Vite production build.
- Installing backend dependencies.
- Checking the Flask health endpoint.
- Testing registration and login.
- Verifying dashboard data.
- Creating, editing, and deleting expense records.
- Checking frontend-to-backend communication.
- Reviewing browser console and backend logs.
- Verifying deployment status on Vercel and Render.

From the `client` directory, the following commands can be used if defined in `package.json`:

```bash
npm run lint
npm run build
```

## Git Collaboration Workflow

The team uses Git and GitHub to coordinate development.

The recommended workflow is:

1. Update the shared development branch.
2. Create or switch to an appropriate feature branch.
3. Make focused changes.
4. Test the changes locally.
5. Commit with a meaningful message.
6. Push the feature branch.
7. Open a pull request against `dev`.
8. Review changes and resolve conflicts.
9. Merge after the required checks pass.
10. Integrate reviewed work into `main` for final submission.

Example commands for updating the shared development branch:

```bash
git switch dev
git pull upstream dev
```

Example commands for creating a feature branch:

```bash
git switch -c feature/your-feature-name
```

After making and testing changes:

```bash
git add <files-you-changed>
git commit -m "Describe the change clearly"
git push -u origin feature/your-feature-name
```

Replace example branch names and file paths with the actual values for your work. Review `git status` before committing to avoid including unrelated files.

## Security Considerations

- Keep secret keys and credentials out of source control.
- Use environment variables for deployment configuration.
- Protect authenticated endpoints with appropriate authentication checks.
- Validate incoming data on the backend.
- Ensure users can access only records they are authorized to access.
- Use HTTPS for production traffic.
- Handle passwords securely and never store them in plaintext.
- Configure database access permissions appropriately.
- Review dependencies and deployment logs regularly.

## Future Development

Potential future improvements include:

- More detailed financial reports and visualizations.
- Income tracking and categorization.
- Date-based and category-based transaction filtering.
- Budget limits and spending alerts.
- Exportable financial reports.
- Improved automated testing.
- Persistent production database configuration.
- Further accessibility and responsive-design improvements.

These are potential enhancements and should not be interpreted as already completed features.

## Team Contributions

The application was developed collaboratively. Contributions include frontend development, application pages, dashboard development, transaction management, backend API development, database setup, and deployment.

| Team member | Contribution |
|---|---|
| Maureen Wanjira (123Mwanjira) | React and Vite frontend development, landing page, frontend styling, Flask API integration, testing, and deployment support |
| Joshua Magolo | Application pages and authentication-related frontend work |
| Bernard Marangu | Dashboard components and styling |Dashboard updates and integration work |
| Fatuhdin Ibrahim Ali | Transactions and expense-management features |
| DiniX-1 | Flask authentication and transaction API work, backend cleanup, and integration support |

This summary describes areas of work and is not an exhaustive list of every contribution. The repository's commits and pull requests provide the detailed development history.

## Repository

**GitHub:** https://github.com/SDF-PT14-Group-6/Smart-Expense-Tracking-Application

**Live Frontend:** https://smart-expense-tracking-application-ld8s-jwnrh7gv5.vercel.app/

**Backend Health Check:** https://smart-expense-tracking-application.onrender.com/api/health