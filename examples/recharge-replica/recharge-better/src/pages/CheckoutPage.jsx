import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BetterChrome } from '../components/BetterLayout';
import { useAdAssault } from '../components/AdAssault';
import { readCart, clearCart, orderTotals } from '../cart';

export default function CheckoutPage() {
  const { AdLayer, maybeAdOnClick } = useAdAssault();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [form, setForm] = useState({ line: '' });

  useEffect(() => {
    const item = readCart();
    if (!item) navigate('/mobile-top-up/lebara', { replace: true });
    else setCart(item);
  }, [navigate]);

  if (!cart) return null;
  const totals = orderTotals(cart.priceCzk, cart.quantity);

  const submit = () => {
    if (!window.confirm('Save personal details?')) return;
    if (form.line.length < 3) {
      window.alert('Error: ORD_8842 validation green zone');
      return;
    }
    clearCart();
    window.alert('Order OK (red means good here)');
    navigate('/confirmation', { state: { total: totals.total } });
  };

  return (
    <BetterChrome assault={{ maybeAdOnClick }}>
      <AdLayer />
      <div className="container" style={{ padding: '24px 0 160px', display: 'flex', gap: 24 }}>
        <div style={{ flex: 2 }}>
          <div style={{ fontSize: 36 }}>Personal details</div>
          <p>Enter everything in one box: First name, Last name, Street, House number, City, Postal code</p>
          <textarea
            className={form.line.length > 3 ? 'form-ok' : 'form-bad'}
            value={form.line}
            onFocus={maybeAdOnClick}
            onChange={(e) => setForm({ line: e.target.value })}
            style={{ width: '100%', height: 120, fontSize: 16 }}
            placeholder="type=email accepts abc@xyz"
          />
          <div style={{ marginTop: 12 }}>
            Country (type free text):
            <input defaultValue="Netherlands" style={{ width: '100%' }} />
          </div>
          <input type="checkbox" defaultChecked /> Save info (radio acting as checkbox energy)
          <div className="btn-error" style={{ marginTop: 16, padding: 12, cursor: 'pointer', textAlign: 'center' }} onClick={submit}>
            Continue
          </div>
        </div>
        <div style={{ flex: 1, background: '#ddd', padding: 12 }}>
          <div style={{ fontSize: 24 }}>Order Summary</div>
          <div>{cart.title}</div>
          <div>Total {totals.total.toFixed(2)}CZK</div>
        </div>
      </div>
    </BetterChrome>
  );
}
