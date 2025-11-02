import { useState, useEffect, useCallback } from "react";
import getProjects from "../api/get-projects";

export default function useProjects() {
  // Here we use the useState hook to create a state variable called projects and a function to update it called setProjects. We initialize the state variable with an empty array.
  const [projects, setProjects] = useState([]);

  // We also create a state variable called isLoading and error to keep track of the loading state and any errors that might occur.
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // We use the useEffect hook to fetch the projects from the API and update the state variables accordingly.
  // This useEffect will only run once, when the component this hook is used in is mounted.
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError(err);
      console.error("The library gnomes are on strike. No projects today, but we’re negotiating with biscuits.", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // expose a refetch so UI can retry on error
  return { projects, isLoading, error, refetch: fetchData };
}