import { ArrowUpRight } from 'lucide-react';
import { ui, getProjectText } from '../lib/i18n';

export default function ProjectsShowcase({ onOpen, language, projectsData }) {
  const copy = ui[language];

  return (
    <section className="projects-section section-shell" id="projects" data-reveal>
      <div className="section-heading-row">
        <div>
          <p className="eyebrow">{copy.projectsKicker}</p>
          <h2>{copy.projects}</h2>
          <p>{copy.projectsDescription}</p>
        </div>
      </div>

      <div className="project-grid">
        {projectsData.map((project, index) => (
          <article
            className={`showcase-project ${index === 0 ? 'featured' : ''}`}
            key={project.id}
            data-reveal
          >
            <div className="project-visual">
              {project.image_url && (
                <img
                  src={project.image_url}
                  alt=""
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.parentElement.classList.add('image-error');
                  }}
                />
              )}
              <span className="project-visual-code">{'</>'}</span>
            </div>

            <div className="project-number">0{index + 1}</div>

            <div className="project-content">
              <h3>{getProjectText(project, language).title}</h3>
              <p>{getProjectText(project, language).description}</p>
              <div className="project-tags">
                {(project.technologies || []).slice(0, 5).map((technology) => (
                  <span className="mini-tag" key={technology}>
                    {technology}
                  </span>
                ))}
              </div>
              <button className="text-link" onClick={() => onOpen(project)}>
                {copy.details}
                <ArrowUpRight size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
