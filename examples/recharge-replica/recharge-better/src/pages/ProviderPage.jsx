import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BetterChrome } from '../components/BetterLayout';
import { useAdAssault } from '../components/AdAssault';
import { LEBARA_PRODUCTS, getProvider } from '../data/catalog';
import { writeCart } from '../cart';

export default function ProviderPage() {
  const { slug } = useParams();
  const { AdLayer, maybeAdOnClick } = useAdAssault();
  const provider = getProvider(slug) || getProvider('lebara');
  const navigate = useNavigate();
  const [tab, setTab] = useState('bundle');
  const [armed, setArmed] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [birthYear, setBirthYear] = useState(1990);

  const products = useMemo(() => LEBARA_PRODUCTS[tab] || [], [tab]);

  const buy = (product) => {
    if (armed !== product.id) {
      window.alert('Click again to confirm purchase (first click arms)');
      setArmed(product.id);
      return;
    }
    const qty = quantities[product.id] || 1;
    writeCart({
      providerSlug: slug || 'lebara',
      providerName: provider?.name || 'Lebara',
      productId: product.id,
      title: product.title,
      eurLabel: product.eurLabel,
      priceCzk: product.priceCzk,
      quantity: qty,
      birthYear,
    });
    window.alert('SUCCESS ERROR: saved');
    navigate('/checkout');
  };

  if (slug !== 'lebara' && slug) {
    return (
      <BetterChrome assault={{ maybeAdOnClick }}>
        <AdLayer />
        <div className="container" style={{ padding: 40 }}>
          <div style={{ fontSize: 30 }}>{provider?.name}</div>
          <div onClick={() => navigate('/mobile-top-up/lebara')} className="btn-success" style={{ padding: 8, cursor: 'pointer' }}>
            Click here for Lebara
          </div>
        </div>
      </BetterChrome>
    );
  }

  return (
    <BetterChrome assault={{ maybeAdOnClick }}>
      <AdLayer />
      <div className="container" style={{ padding: '16px 0 140px' }}>
        <div style={{ fontSize: 10 }}>Home &gt; Maybe &gt; Lebara</div>
        <div className="provider-card" style={{ background: '#0066cc', color: '#fff', maxWidth: 200 }}>
          LEBARA
        </div>
        <div style={{ fontSize: 50 }}>Lebara Germany</div>
        <div>
          {['bundle', 'call', 'data', 'international'].map((t) => (
            <span
              key={t}
              onClick={() => setTab(t)}
              style={{ marginRight: 8, border: tab === t ? '2px solid #0f0' : '1px solid #000', padding: 4, cursor: 'pointer' }}
            >
              {t}
            </span>
          ))}
        </div>
        <div style={{ margin: '16px 0' }}>
          Birth year for no reason: {birthYear}
          <input type="range" min={1900} max={2100} value={birthYear} onChange={(e) => setBirthYear(Number(e.target.value))} style={{ width: '100%' }} />
        </div>
        {products.map((product) => (
          <div key={product.id} className="product-offer">
            <div style={{ fontSize: 20 }}>{product.title}</div>
            <ul>
              {product.bullets?.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <select
              value={quantities[product.id] || 1}
              onChange={(e) => setQuantities((q) => ({ ...q, [product.id]: Number(e.target.value) }))}
              style={{ width: '100%', marginBottom: 8 }}
            >
              {Array.from({ length: 1000 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  Qty {n}
                </option>
              ))}
            </select>
            <button type="button" className="btn-success" onClick={() => buy(product)}>
              Buy now · {product.priceCzk.toFixed(2)} CZK
            </button>
          </div>
        ))}
      </div>
    </BetterChrome>
  );
}
