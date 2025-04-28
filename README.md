# Book Search Engine

A full-stack MERN (MongoDB, Express, React, Node.js) application that allows users to search for books using the Google Books API, save their favorite books, and manage their saved books.

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [License](#license)

## Description

The Book Search Engine is a web application that enables users to search for books, view details, and save their favorite books for later reference. It includes user authentication and authorization using JSON Web Tokens (JWT).

## Features

- Search for books using the Google Books API.
- User authentication (signup, login, logout).
- Save books to a personal list.
- View and delete saved books.
- Responsive design for desktop and mobile devices.

## Technologies Used

- **Frontend**: React, React Router, React Bootstrap
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **Other Tools**: TypeScript, dotenv, bcrypt

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Book-Search-Engine
   ```

2. Install dependencies for both the client and server:
   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the `server` directory with the following:
     ```
     JWT_SECRET_KEY=<your-secret-key>
     MONGODB_URI=<your-mongodb-uri>
     ```

4. Build the project:
   ```bash
   npm run build
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`.
2. Use the search bar to find books.
3. Sign up or log in to save books to your account.
4. View your saved books on the "Saved Books" page.

## Folder Structure

```
Book-Search-Engine/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── App.tsx
│   ├── package.json
│   └── tsconfig.json
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── README.md
└── tsconfig.json
```

## License

This project is licensed under the MIT License.
```

