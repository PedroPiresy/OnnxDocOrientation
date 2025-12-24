import { useState, useEffect } from 'react';
import { Terminal as TerminalIcon, Github, Mail, Linkedin, Code2, Star, GitFork } from 'lucide-react';
import TypingText from './TypingText';
import SectionLoading from './SectionLoading';
import { useGitHubProjects } from '../hooks/useGitHubProjects';
import { GITHUB_USERNAME, USE_GITHUB_PROJECTS } from '../config';
import { Project } from '../types/github';

export default function Terminal() {
  const [activeSection, setActiveSection] = useState('about');
  const [isLoading, setIsLoading] = useState(false);
  const [showContent, setShowContent] = useState(true);

  // Projetos estáticos como fallback
  const staticProjects: Project[] = [
    {
      name: 'project-1',
      description: 'Descrição do projeto incrível que você desenvolveu',
      tech: ['React', 'TypeScript', 'Node.js'],
      link: 'https://github.com/seu-usuario/projeto-1'
    },
    {
      name: 'project-2',
      description: 'Outro projeto fantástico do seu portfólio',
      tech: ['Python', 'FastAPI', 'PostgreSQL'],
      link: 'https://github.com/seu-usuario/projeto-2'
    },
    {
      name: 'project-3',
      description: 'Mais um projeto demonstrando suas habilidades',
      tech: ['Vue.js', 'Express', 'MongoDB'],
      link: 'https://github.com/seu-usuario/projeto-3'
    }
  ];

  // Busca projetos do GitHub se configurado
  const { projects: githubProjects, loading: githubLoading, error: githubError } = useGitHubProjects(
    GITHUB_USERNAME,
    USE_GITHUB_PROJECTS && GITHUB_USERNAME !== 'seu-usuario-github' && GITHUB_USERNAME !== ''
  );

  // Usa projetos do GitHub se disponíveis, caso contrário usa os estáticos
  const projects = githubProjects.length > 0 ? githubProjects : staticProjects;

  const skillsByCategory = {
    'Languages': ['JavaScript', 'TypeScript', 'C#','Angular', 'React', '.NET Core'],
    'Linux': ['Ubuntu', 'Mint', 'Arch', 'Red Hat', 'Debian', 'Fedora', 'CentOS'],
    'Virtualizadores': ['Oracle Linux Virtualization Manager', 'Red Hat Enterprise Virtualization', 'OpenStack', 'VMware'],
    'CI/CD': ['GitLab', 'Jenkins', 'Terraform', 'Ansible'],
    'Tools': ['Apache','Apache Tomcat', 'Git', 'Webpack', 'Docker'],
    'Machine Learning': ['Yolo','TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy'],
  };

  // Efeito para mostrar loading ao mudar de seção
  useEffect(() => {
    setIsLoading(true);
    setShowContent(false);
    
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      setShowContent(true);
    }, 800);

    return () => clearTimeout(loadingTimer);
  }, [activeSection]);

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="border-2 border-green-500 rounded-lg overflow-hidden shadow-2xl shadow-green-500/20">
          <div className="bg-green-900/20 border-b-2 border-green-500 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TerminalIcon size={20} />
              <span className="text-sm">portfolio@terminal:~$</span>
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </div>

          <div className="p-6 md:p-8 min-h-[600px]">
            <div className="mb-8">
              <div className="text-green-400 mb-2">$ ls -la /home/portfolio/</div>
              <div className="flex flex-wrap gap-4 mb-6">
                <button
                  onClick={() => setActiveSection('about')}
                  className={`hover:bg-green-500/20 px-3 py-1 rounded transition ${
                    activeSection === 'about' ? 'bg-green-500/30' : ''
                  }`}
                >
                  about.txt
                </button>
                <button
                  onClick={() => setActiveSection('projects')}
                  className={`hover:bg-green-500/20 px-3 py-1 rounded transition ${
                    activeSection === 'projects' ? 'bg-green-500/30' : ''
                  }`}
                >
                  projects/
                </button>
                <button
                  onClick={() => setActiveSection('skills')}
                  className={`hover:bg-green-500/20 px-3 py-1 rounded transition ${
                    activeSection === 'skills' ? 'bg-green-500/30' : ''
                  }`}
                >
                  skills.sh
                </button>
                <button
                  onClick={() => setActiveSection('contact')}
                  className={`hover:bg-green-500/20 px-3 py-1 rounded transition ${
                    activeSection === 'contact' ? 'bg-green-500/30' : ''
                  }`}
                >
                  contact.md
                </button>
              </div>
            </div>

            <div className="animate-fadeIn">
              {isLoading && <SectionLoading />}
              {!isLoading && showContent && activeSection === 'about' && (
                <div>
                  <div className="text-green-400 mb-4">$ cat about.txt</div>
                  <div className="space-y-4 text-green-300">
                    <p className="text-xl mb-4">
                      <span className="text-green-500">&gt;</span>{' '}
                      <TypingText text="Olá! Bem-vindo ao meu portfólio" speed={50} />
                    </p>
                    <p>
                      <TypingText text="Sou um desenvolvedor apaixonado por tecnologia e código limpo. Especializado em criar soluções elegantes para problemas complexos." speed={30} />
                    </p>
                    <p>
                      <TypingText text="Este terminal é uma representação da minha filosofia de trabalho: simples, direto e eficiente." speed={30} />
                    </p>
                    <p className="text-green-500 mt-6">
                      <TypingText text="[!] Navegue pelos arquivos acima para conhecer mais sobre mim" speed={30} />
                    </p>
                  </div>
                </div>
              )}

              {!isLoading && showContent && activeSection === 'projects' && (
                <div>
                  <div className="text-green-400 mb-4">$ ls -l projects/</div>
                  {githubLoading && (
                    <div className="py-4">
                      <SectionLoading />
                    </div>
                  )}
                  {githubError && (
                    <div className="text-yellow-500 mb-4 text-sm">
                      [!] Erro ao carregar projetos do GitHub: {githubError}. Mostrando projetos estáticos.
                    </div>
                  )}
                  {!githubLoading && (
                    <div className="space-y-6">
                      {projects.length === 0 ? (
                        <div className="text-green-300">
                          Nenhum projeto encontrado. Configure seu username do GitHub no arquivo config.ts
                        </div>
                      ) : (
                        projects.map((project, index) => (
                          <a
                            key={index}
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block border border-green-500/30 rounded p-4 hover:bg-green-500/10 hover:border-green-500/50 transition cursor-pointer"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Code2 size={18} />
                                <span className="text-green-400 font-bold">{project.name}</span>
                                {project.stars !== undefined && project.stars > 0 && (
                                  <span className="flex items-center gap-1 text-yellow-500 text-xs">
                                    <Star size={14} />
                                    {project.stars}
                                  </span>
                                )}
                                {project.forks !== undefined && project.forks > 0 && (
                                  <span className="flex items-center gap-1 text-green-500 text-xs">
                                    <GitFork size={14} />
                                    {project.forks}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-green-300 hover:text-green-100 transition">
                                <Github size={16} />
                                <span className="text-sm">repo</span>
                              </div>
                            </div>
                            <p className="text-green-300 mb-3">
                              <TypingText text={project.description} speed={20} />
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {project.tech.map((tech, i) => (
                                <span key={i} className="text-xs px-2 py-1 bg-green-500/20 rounded">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </a>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              {!isLoading && showContent && activeSection === 'skills' && (
                <div>
                  <div className="text-green-400 mb-4">$ ./skills.sh --list</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(skillsByCategory).map(([category, skills]) => (
                      <div key={category} className="border border-green-500/30 rounded p-3">
                        <div className="text-green-400 font-bold mb-2 text-sm">
                          <TypingText text={`[${category}]`} speed={40} />
                        </div>
                        <div className="space-y-1">
                          {skills.map((skill, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <span className="text-green-500">&gt;</span>
                              <span className="text-green-300 text-sm">{skill}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-green-500 text-sm">
                    <p>
                      <TypingText 
                        text={`[${Object.values(skillsByCategory).flat().length} skills loaded successfully]`} 
                        speed={30} 
                      />
                    </p>
                  </div>
                </div>
              )}

              {!isLoading && showContent && activeSection === 'contact' && (
                <div>
                  <div className="text-green-400 mb-4">$ cat contact.md</div>
                  <div className="space-y-4">
                    <p className="text-green-300 mb-6">
                      <TypingText text="Vamos trabalhar juntos? Entre em contato através dos canais abaixo:" speed={30} />
                    </p>
                    <div className="space-y-4">
                      <a
                        href="https://github.com/seu-usuario"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-green-300 hover:text-green-100 transition group"
                      >
                        <Github size={24} />
                        <span className="group-hover:translate-x-1 transition-transform">
                          <TypingText text="github.com/seu-usuario" speed={40} />
                        </span>
                      </a>
                      <a
                        href="mailto:seu-email@exemplo.com"
                        className="flex items-center gap-3 text-green-300 hover:text-green-100 transition group"
                      >
                        <Mail size={24} />
                        <span className="group-hover:translate-x-1 transition-transform">
                          <TypingText text="seu-email@exemplo.com" speed={40} />
                        </span>
                      </a>
                      <a
                        href="https://linkedin.com/in/seu-perfil"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-green-300 hover:text-green-100 transition group"
                      >
                        <Linkedin size={24} />
                        <span className="group-hover:translate-x-1 transition-transform">
                          <TypingText text="linkedin.com/in/seu-perfil" speed={40} />
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-green-500/30">
              <div className="flex items-center gap-2">
                <span className="text-green-500">$</span>
                <span className="animate-pulse">_</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-green-500/50 text-sm">
          <p>Press Ctrl+C to exit | Type 'help' for available commands</p>
        </div>
      </div>
    </div>
  );
}
