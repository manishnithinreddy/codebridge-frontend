# CodeBridge Frontend

This is the frontend application for CodeBridge, a platform for API testing and management.

## Features

- Project management
- Collection management
- Environment management
- Project sharing
- API testing

## Development Setup

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. Clone the repository
```bash
git clone https://github.com/manishnithinreddy/codebridge-frontend.git
cd codebridge-frontend
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:4200`

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Backend Integration

This frontend application integrates with the CodeBridge backend API. Make sure to update the API base URL in the environment configuration files:

- `src/environments/environment.ts` (development)
- `src/environments/environment.prod.ts` (production)

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   └── services/
│   ├── features/
│   │   ├── project/
│   │   ├── collection/
│   │   ├── environment/
│   │   └── project-sharing/
│   └── shared/
│       └── components/
└── environments/
```

## License

This project is licensed under the MIT License.

