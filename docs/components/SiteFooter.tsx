import type { FC } from 'react';

export const SiteFooter: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="site-footer__inner">
        <div className="site-footer__col-brand">
          <div className="site-footer__logo-wrap">
            <img
              src="/docs/assets/logo/hesh-icon.svg"
              alt="Hesh UI"
              width="24"
              height="24"
              className="site-footer__logo"
            />
            <span className="site-footer__name">Hesh UI</span>
            <span className="site-footer__version">v0.2.0</span>
          </div>
          <p className="site-footer__copyright">
            &copy; {currentYear} Mahesh Abeykoon. Released under the MIT License.
          </p>
          <p className="site-footer__tagline">
            Zero-dependency, accessible, token-driven React UI components.
          </p>
        </div>

        <div className="site-footer__col-links">
          <div className="site-footer__group">
            <span className="site-footer__heading">Documentation</span>
            <a href="#/getting-started" className="site-footer__link">Getting Started</a>
            <a href="#/button" className="site-footer__link">Components</a>
            <a href="#/theming" className="site-footer__link">Design Tokens</a>
            <a href="#/playground" className="site-footer__link">Live Playground</a>
          </div>

          <div className="site-footer__group">
            <span className="site-footer__heading">Community</span>
            <a
              href="https://github.com/Mahesh-Abeykoon/hesh"
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer__link"
            >
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/hesh-ui"
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer__link"
            >
              npm Registry
            </a>
            <a
              href="https://github.com/Mahesh-Abeykoon/hesh/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer__link"
            >
              Report an Issue
            </a>
          </div>

          <div className="site-footer__group site-footer__group--sponsor">
            <span className="site-footer__heading">Deployment</span>
            <a
              href="https://vercel.com/?utm_source=hesh-ui&utm_campaign=oss"
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer__vercel-badge"
              title="Powered by Vercel Open Source Sponsorship"
            >
              <svg
                aria-label="Vercel logomark"
                height="14"
                role="img"
                style={{ width: 'auto', overflow: 'visible' }}
                viewBox="0 0 76 65"
                fill="currentColor"
              >
                <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
              </svg>
              <span>Powered by <strong>Vercel</strong></span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
