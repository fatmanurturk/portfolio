import { ui } from '../lib/i18n';
import { staticCertificates } from '../data/certificates';

export default function CertificatesSection({ language, certificatesData }) {
  const copy = ui[language];

  // Supabase boş dönerse dile göre statik fallback'i kullan
  const certificates =
    certificatesData.length > 0
      ? certificatesData
      : staticCertificates[language] ?? staticCertificates.tr;

  return (
    <section
      className="certificates-section section-shell"
      id="certificates"
      data-reveal
    >
      <div className="section-heading-row">
        <div>
          <p className="eyebrow">{copy.learning}</p>
          <h2>{copy.certificates}</h2>
        </div>
      </div>

      <div className="certificate-grid">
        {certificates.map((certificate) => (
          <article className="certificate-card" key={certificate.title}>
            <span className="certificate-mark">✦</span>
            <h3>{certificate.title}</h3>
            <p>{certificate.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
