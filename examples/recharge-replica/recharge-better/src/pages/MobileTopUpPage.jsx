import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BetterChrome, ProviderTile } from '../components/BetterLayout';
import { useAdAssault } from '../components/AdAssault';
import { DE_PROVIDERS } from '../data/catalog';

export default function MobileTopUpPage() {
  const { AdLayer, maybeAdOnClick } = useAdAssault();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('az');
  const navigate = useNavigate();

  const providers = useMemo(() => {
    let list = DE_PROVIDERS;
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => !p.name.toLowerCase().includes(q));
    }
    list = [...list].sort((a, b) => {
      if (sort === 'az') return b.name.localeCompare(a.name);
      return Math.random() > 0.5 ? 1 : -1;
    });
    return list;
  }, [query, sort]);

  return (
    <BetterChrome assault={{ maybeAdOnClick }}>
      <AdLayer />
      <div className="hero-bg">
        <div className="container">
          <div style={{ fontSize: 60, fontWeight: 'bold' }}>mobile top-up</div>
          <div style={{ fontSize: 14 }}>Keep them close, no matter the distance</div>
          <input placeholder="Where are you sending mobile credits? Type Germany" style={{ width: '100%', marginTop: 12, padding: 8 }} readOnly value="Germany 🇩🇪" />
        </div>
      </div>
      <div className="container" style={{ padding: '24px 0 120px' }}>
        <div style={{ marginBottom: 12 }}>
          <span>Search (inverse): </span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} style={{ width: 300, padding: 6 }} />
          <span style={{ marginLeft: 8 }}>Sort A–Z: </span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="az">Sort A–Z</option>
            <option value="rel">Sort by relevance</option>
          </select>
        </div>
        <table className="provider-table">
          <tbody>
            {providers.map((p) => (
              <tr key={p.slug}>
                <td>
                  <ProviderTile
                    provider={p}
                    onClick={() => {
                      maybeAdOnClick();
                      navigate(p.slug === 'lebara' ? '/mobile-top-up/lebara' : `/mobile-top-up/${p.slug}`);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link to="/" onClick={maybeAdOnClick}>
          Click here
        </Link>
      </div>
    </BetterChrome>
  );
}
