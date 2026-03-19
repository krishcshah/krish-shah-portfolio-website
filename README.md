# Krish Shah's Portfolio Website

Welcome to the source code for my personal portfolio website and blog. Here you can find information about my projects, skills, and read my latest blog posts.

## Tech Stack

This project is built using modern web development technologies:

*   **React:** Frontend library for building user interfaces.
*   **Vite:** Fast, modern build tool and development server.
*   **Tailwind CSS:** Utility-first CSS framework for rapid and responsive styling.
*   **React Router:** For seamless client-side navigation.
*   **Firebase:** Used for backend services (database, authentication, etc.).
*   **Markdown:** Blog posts are rendered from Markdown using `react-markdown`.
*   **TypeScript:** For static typing and better developer experience.

## Setting Up the Project Locally

To run this project on your local machine, follow these steps:

### Prerequisites

*   [Node.js](https://nodejs.org/) installed on your machine.
*   A Firebase project setup with the necessary credentials.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/krishcshah/krish-shah-portfolio-website.git
    cd krish-shah-portfolio-website
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env.local` file in the root of the project and add your necessary API keys and environment variables (like Firebase configuration). Refer to `.env.example` if available.

4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## Scripts

*   `npm run dev`: Starts the development server.
*   `npm run build`: Builds the app for production into the `dist` folder.
*   `npm run preview`: Locally previews the production build.
*   `npm run lint`: Runs TypeScript type checking.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
