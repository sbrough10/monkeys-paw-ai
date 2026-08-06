import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SiteHeader, CookieBanner, ProviderTile } from '../components/Layout';
import { DE_PROVIDERS } from '../data/catalog';

export default function MobileTopUpPage() {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('az');

  const providers = useMemo(() => {
    let list = DE_PROVIDERS.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()));
    list = [...list].sort((a, b) => (sort === 'az' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
    return list;
  }, [query, sort]);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main">
        <section
          style={{
            background: 'linear-gradient(105deg, #e040fb 0%, #ff9800 55%, #fff 55%)',
            padding: '2rem 0 4rem',
          }}
        >
          <div className="container">
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, margin: '1rem 0 0.5rem' }}>Mobile top-up</h1>
            <p style={{ fontSize: '1.25rem', marginBottom: '2rem', maxWidth: 480 }}>Keep them close, no matter the distance</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
              <div
                style={{
                  background: '#fff',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-nav)',
                  maxWidth: 420,
                }}
              >
                <label htmlFor="send-country" style={{ fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>
                  Where are you sending mobile credits?
                </label>
                <select id="send-country" defaultValue="de" style={{ width: '100%', borderRadius: 'var(--radius-pill)', padding: '0.75rem', fontSize: '1rem' }}>
                  <option value="de">🇩🇪 Germany</option>
                </select>
              </div>
              <div aria-hidden="true" style={{ textAlign: 'center', fontSize: '4rem' }}>
                📱🌍📱
              </div>
            </div>
          </div>
        </section>
        <section className="container" style={{ padding: '2rem 0 4rem' }}>
          <h2 className="visually-hidden">Mobile providers in Germany</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
            <label htmlFor="provider-search" className="visually-hidden">
              Search providers
            </label>
            <input
              id="provider-search"
              type="search"
              placeholder="Search providers"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ flex: 1, minWidth: 200, borderRadius: 'var(--radius-pill)', padding: '0.75rem 1rem', border: '1px solid #d1d5db', fontSize: '1rem' }}
            />
            <label htmlFor="provider-sort" style={{ fontWeight: 600 }}>
              Sort
            </label>
            <select id="provider-sort" value={sort} onChange={(e) => setSort(e.target.value)} style={{ borderRadius: 'var(--radius-pill)', padding: '0.5rem 1rem', minHeight: 44 }}>
              <option value="az">Sort A–Z</option>
              <option value="za">Sort Z–A</option>
            </select>
          </div>
          {providers.length === 0 ? (
            <p role="status">No providers match your search.</p>
          ) : (
          <div className="provider-grid">
            {providers.map((p) => (
              <ProviderTile key={p.slug} provider={p} linkTo={p.slug === 'lebara' ? '/mobile-top-up/lebara' : `/mobile-top-up/${p.slug}`} />
            ))}
          </div>
          )}
          <p style={{ marginTop: '2rem' }}>
            <Link to="/">← Back to home</Link>
          </p>
        </section>
      </main>
      <CookieBanner />
      <style>{`.visually-hidden{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}`}</style>
    </>
  );
}
