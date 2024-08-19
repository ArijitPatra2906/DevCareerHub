import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import AppLayout from "./Layout/app-layout";
import LandingPage from "./pages/landing";
// import PostJobsPage from "./pages/post-job";
import MyJobsPage from "./pages/my-jobs";
import SavedJobsPage from "./pages/saved-job";
import JobListingPage from "./pages/job-listing";
import OnboardingPage from "./pages/onboarding";
import JobPage from "./pages/job";
import { ThemeProvider } from "./components/theme-provider";
import ProtectedRoute from "./components/protected-route";
import PostJob from "./pages/postJob";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/onboarding",
        element: (
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/jobs",
        element: (
          <ProtectedRoute>
            <JobListingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/post-job",
        element: (
          <ProtectedRoute>
            <PostJob />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my-jobs",
        element: (
          <ProtectedRoute>
            <MyJobsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/saved-jobs",
        element: (
          <ProtectedRoute>
            <SavedJobsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/job/:id",
        element: (
          <ProtectedRoute>
            <JobPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
