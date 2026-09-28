import { ui } from '../lib/i18n';
import { experience as staticExperience } from '../data/experience';

export default function ExperienceTimeline({ language, experienceData }) {
  const copy = ui[language];

  const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'tr-TR', {
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(`${date}T00:00:00`));
  };

  const databaseExperience = experienceData.map((item) => ({
    period: item.is_current
      ? `${formatDate(item.start_date)} - ${language === 'en' ? 'Present' : 'Devam Ediyor'}`
      : `${formatDate(item.start_date)} - ${formatDate(item.end_date)}`,
    title: `${item.position} - ${item.company_name}`,
    description: item.description || '',
  }));

  const experiences =
    databaseExperience.length > 0 ? databaseExperience : staticExperience;

  // Tek statik İngilizce çeviri (sadece statik veri kullanıldığında aktif olur)
  const experienceText =
    language === 'en'
      ? {
          period: '40 business days · Summer internship',
          title: 'ERP Intern — Lila Cosmetics',
          description:
            'Worked on a desktop automation system for manufacturing operations using C#, .NET Windows Forms, DevExpress, SQL Server, and LINQ to SQL. Contributed to inventory, warehouse, production tracking, procurement, quality control, recipe management, and user authorization modules.',
        }
      : null;

  return (
    <section
      className="experience-section section-shell"
      id="experience"
      data-reveal
    >
      <div className="section-intro">
        <p className="eyebrow">{copy.career}</p>
        <h2>{copy.experience}</h2>
        <p>{copy.experienceDescription}</p>
      </div>

      {experiences.length > 0 ? (
        experiences.map((item, index) => (
          <div className="timeline-item" key={`${item.title}-${index}`}>
            <span>{item.period}</span>
            <div>
              <h3>
                {language === 'en' && experienceText
                  ? experienceText.title
                  : item.title}
              </h3>
              <p>
                {language === 'en' && experienceText
                  ? experienceText.description
                  : item.description}
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="empty-timeline">
          <span className="timeline-dot" />
          <div>
            <span className="todo-label">TODO</span>
            <h3>Deneyim bilgileri yakında eklenecek</h3>
            <p>
              Gerçek staj ve iş deneyimleri doğrulandığında bu zaman çizelgesinde
              yer alacak.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
