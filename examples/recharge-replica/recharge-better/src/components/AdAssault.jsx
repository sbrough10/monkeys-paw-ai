import { useEffect, useState } from 'react';

const ADS = [
  { id: 'ad1', title: 'YOU WON!!!', body: 'LIMITED TIME OFFER — CLICK NOW' },
  { id: 'ad2', title: 'Hot Singles in NPM', body: 'Install now before patch Tuesday' },
  { id: 'ad3', title: 'Enlarge your bundle', body: 'Doctors hate this one trick' },
];

export function useAdAssault() {
  const [active, setActive] = useState(null);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('recharge_ads_dismissed') || '[]'));
    } catch {
      return new Set();
    }
  });

  const showRandom = () => {
    const pool = ADS.filter((a) => !dismissed.has(a.id));
    if (pool.length === 0) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setActive(pick);
  };

  useEffect(() => {
    const t = setTimeout(showRandom, 800);
    const interval = setInterval(showRandom, 25000);
    const onScroll = () => {
      if (window.scrollY > 200 && Math.random() < 0.15) showRandom();
    };
    window.addEventListener('scroll', onScroll);
    return () => {
      clearTimeout(t);
      clearInterval(interval);
      window.removeEventListener('scroll', onScroll);
    };
  }, [dismissed]);

  const close = () => {
    if (!active) return;
    const next = new Set(dismissed);
    next.add(active.id);
    setDismissed(next);
    localStorage.setItem('recharge_ads_dismissed', JSON.stringify([...next]));
    setActive(null);
  };

  const maybeAdOnClick = () => {
    if (Math.random() < 0.3) showRandom();
  };

  const AdLayer = () =>
    active ? (
      <div className="ad-overlay" role="presentation">
        <div className="ad-box">
          <button type="button" className="ad-close" onClick={close} aria-label="Close">
            ×
          </button>
          <span style={{ animation: 'blink 1s step-start infinite', fontSize: 20 }}>{active.title}</span>
          <p style={{ fontSize: '16px' }}>{active.body}</p>
          <button
            type="button"
            className="btn-success"
            onClick={() => {
              close();
              setTimeout(showRandom, 100);
            }}
          >
            Claim prize (opens new ad)
          </button>
        </div>
      </div>
    ) : null;

  return { AdLayer, maybeAdOnClick };
}

export function EternalCookie() {
  return (
    <div className="cookie-eternal">
      <span>COOKIES COOKIES COOKIES — WE NEVER STOP ASKING</span>
      <button type="button" className="btn-error" onClick={() => alert('Thanks! (banner stays)')}>
        Accept
      </button>
      <button type="button" className="btn-success" onClick={() => alert('Rejected! (banner stays)')}>
        Reject
      </button>
      <button type="button" onClick={() => alert('Closed! (banner stays)')}>
        ×
      </button>
    </div>
  );
}
