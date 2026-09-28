import { ArrowUpRight } from 'lucide-react';
import { ui } from '../lib/i18n';
import { LinkedInIcon, InstagramIcon, SocialLink } from './icons';

export default function ContactCard({ language, profileData }) {
  const copy = ui[language];

  return (
    <section className="contact-card section-shell" id="contact" data-reveal>
      <div>
        <p className="eyebrow">{copy.contactKicker}</p>
        <h2>{copy.contact}</h2>
        <p>{copy.contactDescription}</p>
      </div>

      <div className="contact-side">
        <div className="contact-visual" aria-hidden="true">
          <div className="contact-orbit orbit-one" />
          <div className="contact-orbit orbit-two" />
          <span className="contact-signal">✦</span>
          <span className="contact-code">let&apos;s build</span>
        </div>

        <div className="contact-actions">
          <a className="button primary" href={`mailto:${profileData.email}`}>
            {copy.sendMessage}
            <ArrowUpRight size={17} />
          </a>

          <div className="contact-details">
            <span>
              <small>{copy.email}</small>
              {profileData.email}
            </span>
            <span>
              <small>{copy.location}</small>
              {profileData.location}
            </span>
          </div>

          <div
            className="contact-social-links"
            aria-label="Sosyal medya bağlantıları"
          >
            <SocialLink href={profileData.linkedin} label="LinkedIn">
              <LinkedInIcon size={18} />
            </SocialLink>
            <SocialLink href={profileData.instagram} label="Instagram">
              <InstagramIcon size={18} />
            </SocialLink>
          </div>
        </div>
      </div>
    </section>
  );
}
