# Express Server Backend

A simple Express.js server with ES6 modules, MongoDB connection, and basic setup.

## Features

- Express.js server with ES6 modules
- MongoDB connection with Mongoose
- CORS enabled for cross-origin requests
- Environment variable support
- Basic API endpoints
- Error handling middleware

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```bash
PORT=3000
NODE_ENV=development
```

## Usage

### Development (with auto-reload)
```bash
npm run dev
```

### Production
```bash
npm start
```

## Available Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /api/status` - API status

## Scripts

- `npm start` - Start the server
- `npm run dev` - Start the server with nodemon (auto-reload)
- `npm test` - Run tests (placeholder)

## Dependencies

- **express**: Web framework
- **cors**: Cross-origin resource sharing
- **mongoose**: MongoDB ODM
- **dotenv**: Environment variable loader

## Dev Dependencies

- **nodemon**: Auto-restart server during development 