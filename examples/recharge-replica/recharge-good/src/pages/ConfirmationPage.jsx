import { Link, useLocation } from 'react-router-dom';
import { SiteHeader, CookieBanner } from '../components/Layout';

export default function ConfirmationPage() {
  const { state } = useLocation();
  const total = state?.total?.toFixed(2) ?? '457.85';

  return (
    <>
      <SiteHeader />
      <main className="container" style={{ padding: '4rem 0', textAlign: 'center', maxWidth: 560 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Order confirmed</h1>
        <p role="status" style={{ fontSize: '1.125rem', color: 'var(--gray-700)' }}>
          Your Lebara top-up is on its way to {state?.email || 'your email'}. Total charged: {total} CZK.
        </p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '2rem' }}>
          Back to home
        </Link>
      </main>
      <CookieBanner />
    </>
  );
}

export function HelpPage() {
  return (
    <>
      <SiteHeader />
      <main className="container" style={{ padding: '3rem 0' }}>
        <h1>Help</h1>
        <p>Contact support for orders, refunds, and delivery issues.</p>
        <Link to="/">Return home</Link>
      </main>
    </>
  );
}

export function BrandPage() {
  return (
    <>
      <SiteHeader />
      <main className="container" style={{ padding: '3rem 0' }}>
        <h1>Gift card</h1>
        <p>This brand page mirrors recharge.com catalog stubs. Use Mobile Top-up for the full purchase flow.</p>
        <Link to="/mobile-top-up">Browse mobile top-up</Link>
      </main>
    </>
  );
}
