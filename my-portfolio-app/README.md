# My Portfolio App

This is a personal portfolio application built with React and TypeScript. It showcases various sections including Home, About Me, Skills, Education, and Contact, with a user-friendly interface and a toggle for light and dark modes.

## Project Structure

```
my-portfolio-app
├── public
│   └── index.html          # Main HTML entry point
├── src
│   ├── main.tsx           # Entry point for the React application
│   ├── App.tsx            # Main App component with routing
│   ├── pages               # Contains all page components
│   │   ├── Home.tsx       # Home section
│   │   ├── About.tsx      # About Me section
│   │   ├── Skills.tsx     # Skills section
│   │   ├── Education.tsx   # Education section
│   │   └── Contact.tsx     # Contact section
│   ├── components          # Reusable components
│   │   ├── Navbar.tsx     # Navigation bar
│   │   ├── Footer.tsx     # Footer component
│   │   └── ThemeToggle.tsx # Theme toggle component
│   ├── styles              # Stylesheets
│   │   ├── variables.css   # CSS variables for color scheme
│   │   ├── themes.css      # Light and dark theme styles
│   │   └── global.css      # Global styles
│   ├── hooks               # Custom hooks
│   │   └── useTheme.ts     # Hook for managing theme state
│   └── types               # TypeScript types
│       └── index.ts        # Type definitions
├── package.json            # npm configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
├── .gitignore              # Git ignore file
└── README.md               # Project documentation
```

## Features

- **Responsive Design**: The portfolio is designed to be responsive and user-friendly across devices.
- **Light/Dark Mode Toggle**: Users can switch between light and dark themes for better accessibility.
- **Dynamic Routing**: Each section of the portfolio is accessible via a navigation bar.

## Getting Started

To run this project locally, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd my-portfolio-app
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and visit `http://localhost:3000` to view the application.

## License

This project is licensed under the MIT License.