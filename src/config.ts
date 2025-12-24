/**
 * Configuração do portfólio
 * 
 * Para sincronizar seus projetos do GitHub, substitua 'seu-usuario-github' 
 * pelo seu nome de usuário do GitHub
 */
export const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || 'PedroPiresy';

/**
 * Se deve usar projetos do GitHub (true) ou projetos estáticos (false)
 */
export const USE_GITHUB_PROJECTS = import.meta.env.VITE_USE_GITHUB_PROJECTS !== 'false';

