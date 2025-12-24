export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  url: string; // URL da API do repositório
  language: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork?: boolean;
}

export interface Project {
  name: string;
  description: string;
  tech: string[];
  link: string;
  stars?: number;
  forks?: number;
  updated?: string;
}

