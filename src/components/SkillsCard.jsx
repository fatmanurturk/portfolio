import { Code2 } from 'lucide-react';
import { ui } from '../lib/i18n';

export default function SkillsCard({ language, skillsData }) {
  const copy = ui[language];

  const groupedSkills = skillsData.reduce((groups, skill) => {
    const category =
      skill.category?.trim() || (language === 'tr' ? 'Diğer' : 'Other');
    if (!groups[category]) groups[category] = [];
    groups[category].push(skill);
    return groups;
  }, {});

  return (
    <article className="info-card skills-card" id="skills" data-reveal>
      <div className="card-heading">
        <span className="icon-box">
          <Code2 size={19} />
        </span>
        <h2>{copy.skills}</h2>
      </div>

      <div className="skill-groups">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div className="skill-group" key={category}>
            <h3>{category}</h3>
            <div className="chips">
              {categorySkills.map((skill) => (
                <span className="chip" key={skill.id}>
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
