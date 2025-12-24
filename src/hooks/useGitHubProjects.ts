import { useState, useEffect } from 'react';
import { fetchGitHubProjects } from '../services/github';
import { Project } from '../types/github';

interface UseGitHubProjectsResult {
  projects: Project[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook para buscar projetos do GitHub
 * @param username - Nome de usuário do GitHub
 * @param enabled - Se deve buscar os projetos (default: true)
 */
export function useGitHubProjects(username: string, enabled: boolean = true): UseGitHubProjectsResult {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    if (!username || !enabled) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fetchedProjects = await fetchGitHubProjects(username);
      setProjects(fetchedProjects);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar projetos';
      setError(errorMessage);
      console.error('Erro ao buscar projetos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, enabled]);

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects,
  };
}

