import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import CreateProjectPage from "./pages/CreateProjectPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProjectPage from "./pages/ProjectPage.jsx";
import EditProject from "./pages/EditProject.jsx";

import NavBar from "./components/NavBar.jsx";
import { AuthProvider } from "./components/AuthProvider.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavBar />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      { 
        path: "/about", 
        element: <AboutPage /> 
      },
      { 
        path: "/contact", 
        element: <ContactPage /> 
      },
      { 
        path: "/signup", 
        element: <SignupPage /> 
      },
      { 
        path: "/create-project", 
        element: <CreateProjectPage /> 
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      { 
        path: "/project/:id", 
        element: <ProjectPage /> 
      },
      { 
        path: "project/:id/edit", 
        element: <EditProject /> 
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <div className="app-container">
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  </React.StrictMode>
);