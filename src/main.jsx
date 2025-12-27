/**
 * ============================================================
 * MAIN.JSX - Application Entry Point
 * ============================================================
 * 
 * This is where the React app STARTS. It does three things:
 * 1. Sets up all the routes (which URL shows which page)
 * 2. Wraps everything in AuthProvider (so all pages can access login state)
 * 3. Renders the app to the DOM
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
// ============================================================
// PAGE IMPORTS - Each page component
// ============================================================
import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import CreateProjectPage from "./pages/CreateProjectPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProjectPage from "./pages/ProjectPage.jsx";
import EditProject from "./pages/EditProject.jsx";
// ============================================================
// COMPONENT IMPORTS
// ============================================================
import NavBar from "./components/NavBar.jsx";
import { AuthProvider } from "./components/AuthProvider.jsx";
// ============================================================
// ROUTER CONFIGURATION
// ============================================================
/**
 * createBrowserRouter sets up client-side routing.
 * 
 * HOW IT WORKS:
 * - User visits a URL (e.g., /project/5)
 * - React Router matches it to a route
 * - Renders the corresponding component
 * - NO page refresh needed! (Single Page Application)
 * 
 * NESTED ROUTES:
 * - NavBar is the "parent" route at "/"
 * - All other routes are "children" that render INSIDE NavBar
 * - This is why NavBar appears on every page!
 */
const router = createBrowserRouter([
  {
    path: "/",                // Base path
    element: <NavBar />,      // NavBar wraps all pages
    children: [
      {
        path: "/",            // Home page           
        element: <HomePage />,// Shows project list
      },
      { 
        path: "/about",       // localhost:5173/about  
        element:              
        <AboutPage /> 
      },
      { 
        path: "/contact",     // localhost:5173/contact
        element: <ContactPage /> 
      },
      { 
        path: "/signup",      // localhost:5173/signup
        element: <SignupPage /> 
      },
      { 
        path: "/create-project", // localhost:5173/create-project
        element: <CreateProjectPage /> 
      },
      {
        path: "/login",     // localhost:5173/login
        element: <LoginPage />,
      },
      { 
        path: "/project/:id", // localhost:5173/project/5
        element: <ProjectPage /> // :id is a dynamic parameter!
      },
      { 
        path: "project/:id/edit", // localhost:5173/project/5/edit
        element: <EditProject /> 
      }
    ]
  }
]);
// ============================================================
// RENDER THE APP
// ============================================================
/**
 * ReactDOM.createRoot() - Creates the root React node
 * .render() - Renders our app into the #root div in index.html
 * 
 * COMPONENT HIERARCHY:
 * React.StrictMode (development checks)
 * └── AuthProvider (provides login state to all children)
 *     └── div.app-container (styling wrapper)
 *         └── RouterProvider (handles routing)
 *             └── NavBar
 *                 └── [Current Page Component]
 */

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <div className="app-container">
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  </React.StrictMode>
);