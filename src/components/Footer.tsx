import type { ComponentType } from 'react';
import { InstagramIcon, MoonIcon, SparkleIcon } from './FooterIcons';

interface SocialLink {
  name: string;
  url: string;
  Icon: ComponentType;
}

const SOCIAL_LINKS: SocialLink[] = [
  { name: 'Instagram', url: 'https://www.instagram.com/mmili_rios?obrf=MTdlb3c2eDdoeGVwdA%3D%3D&utm_source=q', Icon: InstagramIcon },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="footer-mark">
            <img src="/images/logo.jpg" alt="" width="56" height="56" />
          </span>

          <div className="footer-name-row">
            <span className="footer-rule" aria-hidden="true" />
            <span className="footer-sparkle" aria-hidden="true">
              <SparkleIcon />
            </span>
            <p className="footer-name">DarkMoon</p>
            <span className="footer-sparkle" aria-hidden="true">
              <SparkleIcon />
            </span>
            <span className="footer-rule footer-rule-end" aria-hidden="true" />
          </div>

          <p className="footer-tagline">Tienda de Halloween</p>
          <p className="footer-quote">La noche tiene algo especial para vos.</p>
        </div>

        <ul className="footer-social" aria-label="Redes sociales">
          {SOCIAL_LINKS.map(({ name, url, Icon }) => (
            <li key={name}>
              {url ? (
                <a
                  className="social-icon"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${name} (se abre en una pestaña nueva)`}
                >
                  <Icon />
                </a>
              ) : (
                <span className="social-icon" role="img" aria-label={name}>
                  <Icon />
                </span>
              )}
            </li>
          ))}
        </ul>

        <div className="footer-divider" aria-hidden="true">
          <span className="footer-rule" />
          <span className="footer-sparkle">
            <SparkleIcon size={14} />
          </span>
          <span className="footer-rule footer-rule-end" />
        </div>

        <p className="footer-copy">
          © 2026 DarkMoon. Todos los derechos reservados.
        </p>
        <p className="footer-motto">
          Viví Halloween
          <MoonIcon size={14} />
        </p>
        <p className="footer-note">DarkMoon – 2026</p>
      </div>
    </footer>
  );
}