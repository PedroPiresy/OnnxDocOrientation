import { GitHubRepository, Project } from '../types/github';

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Busca os repositórios públicos de um usuário do GitHub
 */
export async function fetchGitHubRepos(username: string): Promise<GitHubRepository[]> {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${username}/repos?sort=updated&per_page=100&type=public`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Usuário do GitHub não encontrado');
      }
      throw new Error('Erro ao buscar repositórios do GitHub');
    }
    
    const repos: GitHubRepository[] = await response.json();
    
    // Filtra apenas repositórios que não são forks (opcional, você pode remover isso)
    // return repos.filter(repo => !repo.fork);
    return repos;
  } catch (error) {
    console.error('Erro ao buscar repositórios:', error);
    throw error;
  }
}

/**
 * Converte um repositório do GitHub para o formato de Project
 */
export function convertGitHubRepoToProject(repo: GitHubRepository): Project {
  // Usa topics como tecnologias, ou a linguagem principal
  let tech: string[] = [];
  
  // Se o repositório tem topics, usa eles (filtra alguns que não são tecnologias)
  if (repo.topics && repo.topics.length > 0) {
    const excludedTopics = ['hacktoberfest', 'portfolio', 'website', 'blog'];
    tech = repo.topics
      .filter(topic => !excludedTopics.includes(topic.toLowerCase()))
      .slice(0, 5); // Limita a 5 tecnologias
  }
  
  // Se não tem topics ou poucos, adiciona a linguagem principal
  if (repo.language && !tech.includes(repo.language)) {
    tech.unshift(repo.language);
  }
  
  // Fallback se ainda não tiver tecnologias
  if (tech.length === 0) {
    tech = repo.language ? [repo.language] : ['Code'];
  }

  return {
    name: repo.name,
    description: repo.description || 'Projeto sem descrição',
    tech: tech,
    link: repo.html_url,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    updated: repo.updated_at,
  };
}

/**
 * Busca e converte repositórios do GitHub para projetos
 */
export async function fetchGitHubProjects(username: string): Promise<Project[]> {
  try {
    const repos = await fetchGitHubRepos(username);
    
    // Filtra apenas repositórios que não são forks e limita a 20 mais recentes
    // Se quiser incluir forks também, remova a linha do filter
    const filteredRepos = repos
      .filter(repo => !repo.fork) // Remove forks - comente esta linha se quiser incluir forks
      .slice(0, 20); // Limita a 20 projetos mais recentes
    
    // Converte todos os repositórios (inclui os sem descrição também)
    const projects = filteredRepos.map(repo => convertGitHubRepoToProject(repo));
    
    return projects;
  } catch (error) {
    console.error('Erro ao buscar projetos do GitHub:', error);
    throw error;
  }
}

