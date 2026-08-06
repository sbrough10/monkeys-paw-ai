import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SiteHeader, CookieBanner, ProviderTile } from '../components/Layout';
import { POPULAR_BRANDS } from '../data/catalog';

const FILTERS = [
  { id: 'all', label: 'Show all', icon: '▦' },
  { id: 'mobile', label: 'Mobile Top-up' },
  { id: 'payment', label: 'Payment Cards' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'gaming', label: 'Gaming' },
];

const SLIDES = [
  {
    title: 'Stay in touch with ',
    highlight: 'mobile top-up',
    cta: 'Top up now',
  },
  {
    title: 'Gift cards for ',
    highlight: 'every occasion',
    cta: 'Shop gift cards',
  },
];

export default function HomePage() {
  const [filter, setFilter] = useState('all');
  const [slide, setSlide] = useState(0);
  const navigate = useNavigate();

  const brands = useMemo(() => {
    if (filter === 'all') return POPULAR_BRANDS;
    return POPULAR_BRANDS.filter((b) => b.category === filter);
  }, [filter]);

  const current = SLIDES[slide];

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main">
        <section
          aria-label="Featured promotions"
          style={{
            position: 'relative',
            minHeight: 420,
            background:
              'linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1600&q=80) center/cover',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center', width: '100%' }}>
            <div>
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() => setSlide((s) => (s + SLIDES.length - 1) % SLIDES.length)}
                style={arrowStyle('left')}
              >
                ‹
              </button>
              <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 800, lineHeight: 1.1, maxWidth: 480 }}>
                {current.title}
                <span
                  style={{
                    background: 'linear-gradient(90deg,#fbbf24,#f472b6)',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  {current.highlight}
                </span>
              </h1>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }} role="tablist" aria-label="Carousel pagination">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={i === slide}
                    aria-label={`Slide ${i + 1}`}
                    onClick={() => setSlide(i)}
                    style={{
                      width: i === slide ? 12 : 8,
                      height: 8,
                      borderRadius: 999,
                      border: 'none',
                      background: '#fff',
                      opacity: i === slide ? 1 : 0.5,
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
            </div>
            <div
              style={{
                background: 'rgba(0,0,0,0.45)',
                backdropFilter: 'blur(8px)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.5rem',
              }}
            >
              <label htmlFor="hero-country" style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600 }}>
                Choose recipient&apos;s country
              </label>
              <select id="hero-country" defaultValue="de" style={{ width: '100%', borderRadius: 'var(--radius-pill)', padding: '0.75rem', marginBottom: '1rem', fontSize: '1rem' }}>
                <option value="de">🇩🇪 Germany</option>
                <option value="nl">🇳🇱 Netherlands</option>
              </select>
              <button type="button" className="btn btn-primary" style={{ width: '100%' }} onClick={() => navigate('/mobile-top-up')}>
                {current.cta}
              </button>
            </div>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => setSlide((s) => (s + 1) % SLIDES.length)}
              style={{ ...arrowStyle('right'), position: 'absolute', right: '1rem', top: '50%' }}
            >
              ›
            </button>
          </div>
        </section>

        <section className="container" style={{ padding: '3rem 0' }} aria-labelledby="popular-heading">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <h2 id="popular-heading" style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>
              Most Popular
            </h2>
          </div>
          <div className="filter-tabs" role="tablist" aria-label="Product categories">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={filter === f.id}
                className={`filter-tab${filter === f.id ? ' active' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.icon && <span aria-hidden="true">{f.icon}</span>}
                {f.label}
              </button>
            ))}
          </div>
          {brands.length === 0 ? (
            <p role="status">No products in this category yet.</p>
          ) : (
            <div className="provider-grid">
              {brands.map((b) => (
                <Link key={b.id} to={b.id === 'lyca' || b.id === 'eplus' ? '/mobile-top-up' : `/brand/${b.id}`} style={{ textDecoration: 'none' }}>
                  <ProviderTile
                    provider={{
                      name: b.name,
                      text: b.label,
                      bg: b.bg,
                      dark: b.bg === '#fff' || b.bg === '#ffeb3b',
                      border: b.border,
                    }}
                  />
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <CookieBanner />
    </>
  );
}

function arrowStyle(side) {
  return {
    position: side === 'left' ? 'absolute' : undefined,
    left: side === 'left' ? '1rem' : undefined,
    top: side === 'left' ? '50%' : undefined,
    transform: 'translateY(-50%)',
    width: 44,
    height: 44,
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(255,255,255,0.2)',
    color: '#fff',
    fontSize: '1.5rem',
    cursor: 'pointer',
  };
}
