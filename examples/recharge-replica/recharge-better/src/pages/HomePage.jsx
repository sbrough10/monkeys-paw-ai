import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BetterChrome } from '../components/BetterLayout';
import { useAdAssault } from '../components/AdAssault';
import { POPULAR_BRANDS } from '../data/catalog';

export default function HomePage() {
  const { AdLayer, maybeAdOnClick } = useAdAssault();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const brands = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return POPULAR_BRANDS;
    return POPULAR_BRANDS.filter((b) => !b.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <BetterChrome assault={{ maybeAdOnClick }}>
      <AdLayer />
      <div style={{ background: '#333', color: '#fff', padding: 40, minHeight: 300 }}>
        <div className="container">
          <div style={{ fontSize: 48 }}>Stay in touch with mobile top-up</div>
          <select style={{ marginTop: 16, padding: 8 }}>
            <option>Germany</option>
          </select>
          <div
            className="btn-error"
            style={{ display: 'inline-block', marginTop: 12, padding: '8px 16px', cursor: 'pointer' }}
            onClick={() => {
              maybeAdOnClick();
              navigate('/mobile-top-up');
            }}
          >
            Top up now
          </div>
        </div>
      </div>
      <div className="container" style={{ padding: '24px 0 120px' }}>
        <div style={{ fontSize: 40 }}>Most Popular</div>
        <input placeholder="inverse search brands" value={query} onChange={(e) => setQuery(e.target.value)} style={{ width: '100%', marginBottom: 16 }} />
        <table className="provider-table">
          <tbody>
            {brands.map((b) => (
              <tr key={b.id}>
                <td>
                  <div
                    className="provider-card"
                    style={{ background: b.bg, color: b.bg === '#fff' ? '#000' : '#fff' }}
                    onClick={() => {
                      maybeAdOnClick();
                      navigate('/mobile-top-up');
                    }}
                  >
                    {b.label}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </BetterChrome>
  );
}
