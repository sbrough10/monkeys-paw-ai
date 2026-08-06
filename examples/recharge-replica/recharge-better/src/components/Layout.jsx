import { Link } from 'react-router-dom';

export function Logo({ asLink = true }) {
  const inner = (
    <>
      <div className="logo-mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <span className="logo-text">recharge.com</span>
    </>
  );
  if (asLink) {
    return (
      <Link to="/" className="nav-left" style={{ gap: '0.5rem', textDecoration: 'none' }} aria-label="recharge.com home">
        {inner}
      </Link>
    );
  }
  return <div className="nav-left" style={{ gap: '0.5rem' }}>{inner}</div>;
}

export function TopBar() {
  return (
    <div className="top-bar" role="region" aria-label="Trust indicators">
      <div className="container top-bar-inner">
        <span>🛍 Largest online store for payment cards</span>
        <ul>
          <li>👍 Certified reseller</li>
          <li>🛡 Safe &amp; secure payment</li>
          <li>⚡ Instant digital delivery</li>
        </ul>
      </div>
    </div>
  );
}

export function SiteHeader({ variant = 'default' }) {
  const shellClass = variant === 'checkout' ? 'nav-shell' : 'nav-shell';
  return (
    <header className="site-header">
      {variant !== 'checkout' && <TopBar />}
      <div className="container">
        <nav className={shellClass} aria-label="Main">
          <div className="nav-left">
            <Logo />
            {variant !== 'checkout' && (
              <button type="button" className="categories-btn" aria-haspopup="true" aria-expanded="false">
                Categories ▾
              </button>
            )}
          </div>
          {variant !== 'checkout' && (
            <div className="nav-right">
              <button type="button" className="nav-meta" aria-label="Country Germany">
                🇩🇪 DE
              </button>
              <button type="button" className="nav-meta" aria-label="Currency CZK">
                💳 CZK
              </button>
              <button type="button" className="nav-meta" aria-label="Language English">
                🌐 EN
              </button>
              <Link to="/help" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
                Help
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export function CookieBanner() {
  const dismiss = () => {
    localStorage.setItem('recharge_cookie_consent', '1');
    const el = document.getElementById('cookie-banner');
    if (el) el.hidden = true;
  };
  if (typeof window !== 'undefined' && localStorage.getItem('recharge_cookie_consent')) {
    return null;
  }
  return (
    <div className="cookie-banner" id="cookie-banner" role="dialog" aria-labelledby="cookie-title">
      <div>
        <p id="cookie-title" style={{ margin: 0, fontWeight: 600 }}>
          We use cookies
        </p>
        <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--gray-500)' }}>
          Essential cookies only. Marketing optional.
        </p>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button type="button" className="btn btn-outline" onClick={dismiss}>
          Reject optional
        </button>
        <button type="button" className="btn btn-primary" onClick={dismiss}>
          Accept all
        </button>
      </div>
    </div>
  );
}

export function ProviderTile({ provider, linkTo }) {
  const style = {
    background: provider.bg?.startsWith('linear') ? undefined : provider.bg,
    backgroundImage: provider.bg?.startsWith('linear') ? provider.bg : undefined,
  };
  const className = ['provider-card', provider.dark && 'dark', provider.border && 'bordered'].filter(Boolean).join(' ');
  const content = (
    <>
      <div className={className} style={style}>
        {provider.text}
      </div>
      <p className="provider-name">{provider.name}</p>
    </>
  );
  if (linkTo) {
    return (
      <Link to={linkTo} style={{ textDecoration: 'none' }}>
        {content}
      </Link>
    );
  }
  return content;
}
