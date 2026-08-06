import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SiteHeader, CookieBanner } from '../components/Layout';
import { LEBARA_PRODUCTS, getProvider } from '../data/catalog';
import { writeCart } from '../cart';

const TABS = [
  { id: 'bundle', label: 'Bundle' },
  { id: 'call', label: 'Call Credit' },
  { id: 'data', label: 'Data' },
  { id: 'international', label: 'International' },
];

export default function ProviderPage() {
  const { slug } = useParams();
  const provider = getProvider(slug) || getProvider('lebara');
  const navigate = useNavigate();
  const [tab, setTab] = useState('bundle');
  const [quantities, setQuantities] = useState({});

  const products = useMemo(() => LEBARA_PRODUCTS[tab] || [], [tab]);

  const buy = (product) => {
    const qty = quantities[product.id] || 1;
    writeCart({
      providerSlug: slug || 'lebara',
      providerName: provider?.name || 'Lebara',
      productId: product.id,
      title: product.title,
      eurLabel: product.eurLabel,
      priceCzk: product.priceCzk,
      quantity: qty,
    });
    navigate('/checkout');
  };

  if (slug !== 'lebara' && slug) {
    return (
      <>
        <SiteHeader />
        <main className="container" style={{ padding: '4rem 0' }}>
          <h1>{provider?.name} Germany</h1>
          <p>Full product catalog coming soon. Try Lebara for the complete checkout flow.</p>
          <Link to="/mobile-top-up/lebara">View Lebara products</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main" className="container" style={{ padding: '1.5rem 0 4rem' }}>
        <nav aria-label="Breadcrumb" style={{ marginBottom: '1rem' }}>
          <Link to="/mobile-top-up" style={{ color: 'var(--gray-500)', fontWeight: 600 }}>
            ← Mobile Top-up
          </Link>
        </nav>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 280px) 1fr', gap: '2rem' }}>
          <aside>
            <div
              className="provider-card"
              style={{ background: '#0066cc', aspectRatio: '1.2', fontSize: '1.75rem', borderRadius: 'var(--radius-xl)' }}
            >
              LEBARA
            </div>
            <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem', fontSize: '0.875rem', color: 'var(--gray-700)' }}>
              <li>⚡ Instant digital delivery</li>
              <li>🛡 Safe &amp; secure payment</li>
            </ul>
          </aside>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 0.5rem' }}>Lebara Germany</h1>
            <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem' }}>
              🇩🇪 Country of use: Germany · ✉️ Delivery: Email
            </p>
            <div className="filter-tabs" role="tablist" aria-label="Product type">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  className={`filter-tab${tab === t.id ? ' active' : ''}`}
                  onClick={() => setTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Lebara {TABS.find((t) => t.id === tab)?.label}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {products.map((product) => (
                <article key={product.id} className="product-offer">
                  <h3 style={{ margin: 0, fontSize: '1.125rem' }}>{product.title}</h3>
                  {product.bullets?.length > 0 && (
                    <ul>
                      {product.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  )}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', marginTop: 'auto' }}>
                    <label htmlFor={`qty-${product.id}`} style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      Quantity
                    </label>
                    <select
                      id={`qty-${product.id}`}
                      value={quantities[product.id] || 1}
                      onChange={(e) => setQuantities((q) => ({ ...q, [product.id]: Number(e.target.value) }))}
                      style={{ borderRadius: 'var(--radius-pill)', padding: '0.5rem 1rem', minHeight: 44 }}
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                    <button type="button" className="btn btn-primary" style={{ flex: 1, minWidth: 200 }} onClick={() => buy(product)}>
                      Buy now · {product.priceCzk.toFixed(2)} CZK
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </main>
      <CookieBanner />
    </>
  );
}
