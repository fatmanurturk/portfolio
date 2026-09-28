import { ArrowUpRight } from 'lucide-react';
import { ui, getProjectText } from '../lib/i18n';
import { GitHubIcon } from './icons';

export default function ProjectDetail({ onClose, project, language }) {
  const copy = ui[language];
  const projectText = getProjectText(project, language);

  if (!project) return null;

  return (
    <div className="project-detail">
      <button className="back-link" onClick={onClose}>
        {copy.back}
      </button>

      <p className="eyebrow">{copy.detail}</p>

      <h1>{projectText.title}</h1>

      <p className="detail-lead">{projectText.description}</p>

      <div className="detail-grid">
        <div>
          <h2>{copy.features}</h2>
          <ul className="feature-list">
            {projectText.features?.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2>{copy.technologies}</h2>
          <div className="chips">
            {project.technologies?.map((tech) => (
              <span className="chip" key={tech}>
                {tech}
              </span>
            ))}
          </div>

          {project.github && (
            <a
              className="button secondary detail-github"
              href={project.github}
              target="_blank"
              rel="noreferrer"
            >
              <GitHubIcon size={17} />
              {copy.github}
            </a>
          )}

          {project.liveUrl && (
            <a
              className="button secondary detail-github"
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
            >
              <ArrowUpRight size={17} />
              {language === 'tr' ? 'Canlı Siteyi Gör' : 'View Live Site'}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
