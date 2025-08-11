# Express.js Backend Boilerplate with Prisma and MongoDB

Welcome to the Express.js server application integrated with **Prisma ORM** and **MongoDB**. This project is designed to handle user authentication, follow secure practices, and leverage environment-based configurations.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Database Configuration](#database-configuration)
- [Running the Server](#running-the-server)
- [Contributing](#contributing)
- [License](#license)
- [Dependencies](#dependencies)

## Features

- **Express.js** server framework.
- **MongoDB** integration using **Prisma ORM**.
- **User Authentication** with JWT.
- Secure headers with **Helmet** middleware.
- **CORS** support for cross-origin resource sharing.
- Environment-based configuration using **dotenv**.

## Project Structure
```
└── 📁server
    └── 📁config
        └── config.js
    └── 📁controllers
        └── .gitkeep
    └── 📁db
        └── db.js
    └── 📁middlewares
        └── .gitkeep
    └── 📁prisma
        └── schema.prisma
    └── 📁routes
        └── .gitkeep
    └── 📁utils
        └── .gitkeep
    └── .env copy
    └── .gitignore
    └── .prettierignore
    └── .prettierrc
    └── package-lock.json
    └── package.json
    └── README.md
    └── server.js
```

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/HarshDodiya1/backend-boilerplate.git
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory (see [Environment Variables](#environment-variables)).

4. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

## Environment Variables

Create a `.env` file in the root directory with the following:

```plaintext
PORT=3000
CORS_ORIGIN1=http://localhost:5173
CORS_ORIGIN2=http://localhost:5173
JWT_SECRET=your_jwt_secret_here
LINKEDIN=https://www.linkedin.com/in/your-profile/
GITHUB=https://github.com/your-username/
DATABASE_URL=your_mongodb_connection_string
```

Replace the placeholders with actual values.

## Database Configuration

This project uses MongoDB via Prisma ORM. The database schema is defined in `prisma/schema.prisma`.

Example schema:

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model User {
  id       String  @id @default(auto()) @map("_id") @db.ObjectId
  email    String  @unique
  name     String?
  password String?
}
```

## Running the Server

To start the server in development mode with hot-reloading:

```bash
npm run dev
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

This project is licensed under the ISC License. For more details, refer to the `LICENSE` file.

## Dependencies

Key dependencies used in this project:

- `express`: Web application framework
- `@prisma/client`: Prisma ORM client
- `dotenv`: Environment variable management
- `cors`: Cross-Origin Resource Sharing middleware
- `helmet`: Security middleware
- `body-parser`: Request body parsing middleware
- `cookie-parser`: Cookie parsing middleware
- `morgan`: HTTP request logger middleware

For a complete list of dependencies, please refer to the `package.json` file.
```

This single file includes all the necessary information about the project, setup, and usage. It provides a clear, concise, and organized overview of your Express.js server application with Prisma and MongoDB. Let me know if you need further refinements!