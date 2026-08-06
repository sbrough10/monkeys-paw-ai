import { Link } from 'react-router-dom';
import { EternalCookie } from './AdAssault';

export function BetterChrome({ children, assault }) {
  return (
    <div>
      <div className="marquee-strip">
        <marquee>TODO fix this button — Lorem ipsum ALL CAPS SALE SALE SALE</marquee>
      </div>
      <div className="top-strip">Certified maybe · Payment perhaps · Delivery eventually</div>
      <div className="container">
        <div className="nav-blob">
          <div style={{ display: 'flex', gap: 12 }}>
            <span style={{ fontSize: 32 }}>🟢🟢🟢</span>
            <span style={{ fontSize: 22, fontFamily: 'Impact' }}>recharge.com</span>
            <Link to="/mobile-top-up" onClick={assault?.maybeAdOnClick} title="???">
              🏠
            </Link>
            <Link to="/" onClick={assault?.maybeAdOnClick} title="???">
              🏠
            </Link>
          </div>
          <div>
            <Link to="/help" onClick={assault?.maybeAdOnClick}>
              ?
            </Link>{' '}
            <span>DE CZK EN</span>
          </div>
        </div>
      </div>
      {children}
      <EternalCookie />
    </div>
  );
}

export function ProviderTile({ provider, onClick }) {
  return (
    <div
      onClick={onClick}
      className="provider-card"
      style={{
        background: provider.bg?.startsWith('linear') ? '#009688' : provider.bg,
        color: provider.dark ? '#111' : '#fff',
        border: provider.border ? '1px solid red' : undefined,
        cursor: 'pointer',
      }}
    >
      {provider.text}
      <div style={{ fontSize: 10 }}>{provider.name}</div>
    </div>
  );
}
