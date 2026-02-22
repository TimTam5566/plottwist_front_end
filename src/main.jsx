import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import NavBar from "./components/NavBar.jsx";
import { AuthProvider } from "./components/AuthProvider.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Lazy-load page components for better performance (code splitting)
const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const AboutPage = lazy(() => import("./pages/AboutPage.jsx"));
const ContactPage = lazy(() => import("./pages/ContactPage.jsx"));
const SignupPage = lazy(() => import("./pages/SignupPage.jsx"));
const CreateProjectPage = lazy(() => import("./pages/CreateProjectPage.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const ProjectPage = lazy(() => import("./pages/ProjectPage.jsx"));
const EditProject = lazy(() => import("./pages/EditProject.jsx"));

// Loading fallback while lazy components are loading
function PageLoader() {
    return (
        <main id="main-content" className="page-wrap" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div role="status" aria-live="polite">
                <p className="muted">Turning the page...</p>
                <span aria-hidden="true" style={{ fontSize: '2rem' }}>✒</span>
            </div>
        </main>
    );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavBar />,
    children: [
      {
        path: "/",
        element: <Suspense fallback={<PageLoader />}><HomePage /></Suspense>,
      },
      {
        path: "/about",
        element: <Suspense fallback={<PageLoader />}><AboutPage /></Suspense>,
      },
      {
        path: "/contact",
        element: <Suspense fallback={<PageLoader />}><ContactPage /></Suspense>,
      },
      {
        path: "/signup",
        element: <Suspense fallback={<PageLoader />}><SignupPage /></Suspense>,
      },
      {
        path: "/create-project",
        element: <Suspense fallback={<PageLoader />}><CreateProjectPage /></Suspense>,
      },
      {
        path: "/login",
        element: <Suspense fallback={<PageLoader />}><LoginPage /></Suspense>,
      },
      {
        path: "/project/:id",
        element: <Suspense fallback={<PageLoader />}><ProjectPage /></Suspense>,
      },
      {
        path: "/project/:id/edit",
        element: (
            <Suspense fallback={<PageLoader />}>
                <ProtectedRoute>
                    <EditProject />
                </ProtectedRoute>
            </Suspense>
        ),
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ErrorBoundary>
        <div className="app-container">
          <RouterProvider router={router} />
        </div>
      </ErrorBoundary>
    </AuthProvider>
  </React.StrictMode>
);
