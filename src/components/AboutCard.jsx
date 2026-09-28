import { ui } from '../lib/i18n';

export default function AboutCard({ language, profileData }) {
  const copy = ui[language];

  return (
    <article className="info-card about-card" id="about" data-reveal>
      <div className="card-heading">
        <span className="icon-box">◉</span>
        <h2>{copy.about}</h2>
      </div>

      <p>{profileData.about || copy.aboutText}</p>
      <p>{copy.aboutInternship}</p>

      <ul className="check-list">
        <li>{copy.teamwork}</li>
        <li>{copy.database}</li>
        <li>{copy.userFocused}</li>
      </ul>
    </article>
  );
}
