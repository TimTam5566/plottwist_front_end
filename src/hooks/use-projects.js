/**
 * ============================================================
 * USE-PROJECTS.JS - Fetch & Manage Projects List
 * ============================================================
 * 
 * WHAT THIS DOES:
 * Fetches all projects from the API and manages loading/error states.
 * 
 * WHY A CUSTOM HOOK?
 * Encapsulates all the data fetching logic in one reusable place.
 * Any component that needs the projects list just calls useProjects().
 * 
 * RETURNS:
 * - projects: Array of project objects
 * - isLoading: Boolean - is data being fetched?
 * - error: Error object or null
 * - refetch: Function to retry fetching
 */

import { useState, useEffect, useCallback } from "react";
import getProjects from "../api/get-projects";

export default function useProjects() {
    // ============================================================
    // STATE
    // ============================================================
  const [projects, setProjects] = useState([]); // The data
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // ============================================================
    // FETCH FUNCTION
    // ============================================================
    /**
     * useCallback memoizes the function - it won't be recreated
     * on every render. This prevents unnecessary re-fetches.
     */

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProjects(); // Call API
      setProjects(data);  // Update state with fetched data - store in state
    } catch (err) {
      setError(err);
       // Fun literary error message! 📚
      console.error("The library gnomes are on strike. No projects today, but we’re negotiating with biscuits.", err);
    } finally {
      setIsLoading(false);  // Always stop loading, success or fail
    }
  }, []); // Empty deps = function never changes

  // ============================================================
    // INITIAL FETCH
    // ============================================================
    /**
     * useEffect with [fetchData] dependency:
     * - Runs once when component mounts
     * - fetchData is stable (useCallback), so this only runs once
     */

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ============================================================
    // RETURN VALUES
    // ============================================================
    /**
     * Expose refetch so components can retry on error.
     * Example: <button onClick={refetch}>Try Again</button>
     */

  
  return { projects, isLoading, error, refetch: fetchData };
}

/**
 * USAGE IN COMPONENT:
 * 
 * function HomePage() {
 *     const { projects, isLoading, error, refetch } = useProjects();
 *     
 *     if (isLoading) return <p>Loading...</p>;
 *     if (error) return <button onClick={refetch}>Retry</button>;
 *     
 *     return projects.map(p => <ProjectCard key={p.id} project={p} />);
 * }
 */