# Claude Unlimited Frontend
testing

This is the frontend application for Claude Unlimited, an AI-powered chat interface using Anthropic's Claude-3.5-Sonnet model.

## Project Structure
claude-unlimited-frontend/
├── public/
├── src/
│   ├── components/
│   ├── styles/
│   ├── utils/
│   ├── App.js
│   ├── index.js
│   └── config.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
Copy
## Setup

1. Clone the repository:
git clone https://github.com/yourusername/claude-unlimited-frontend.git
cd claude-unlimited-frontend
Copy
2. Install dependencies:
npm install
Copy
3. Set up environment variables:
Create a `.env` file in the root directory and add:
REACT_APP_API_URL=http://localhost:5000
Copy
4. Run the application:
npm start
Copy
## Deployment to Heroku

1. Create a new Heroku app:
heroku create claude-unlimited-frontend
Copy
2. Set environment variables:
heroku config:set REACT_APP_API_URL=https://your-backend-url.herokuapp.com
Copy
3. Deploy the application:
git push heroku main
Copy
4. Open the deployed application:
heroku open
Copy
## Available Scripts

- `npm start`: Runs the app in development mode.
- `npm test`: Launches the test runner.
- `npm run build`: Builds the app for production.
- `npm run eject`: Ejects from Create React App configuration.

## Learn More

To learn more about the technologies used in this project, refer to:
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Create React App Documentation](https://create-react-app.dev/docs/getting-started/)
