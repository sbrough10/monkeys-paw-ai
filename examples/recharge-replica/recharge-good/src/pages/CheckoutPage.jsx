import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SiteHeader } from '../components/Layout';
import { readCart, clearCart, orderTotals } from '../cart';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    street: '',
    houseNumber: '',
    city: '',
    postalCode: '',
    country: 'Netherlands',
    saveInfo: true,
  });

  useEffect(() => {
    const item = readCart();
    if (!item) navigate('/mobile-top-up/lebara', { replace: true });
    else setCart(item);
  }, [navigate]);

  if (!cart) return null;

  const totals = orderTotals(cart.priceCzk, cart.quantity);

  const validate = () => {
    const next = {};
    ['firstName', 'lastName', 'street', 'houseNumber', 'city', 'postalCode'].forEach((k) => {
      if (!form[k]?.trim()) next[k] = 'This field is required';
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setPending(true);
    setTimeout(() => {
      clearCart();
      navigate('/confirmation', { state: { email: 'stephen.b@gmail.com', total: totals.total } });
    }, 600);
  };

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to checkout form
      </a>
      <SiteHeader variant="checkout" />
      <main id="main" className="container" style={{ padding: '2rem 0 4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(280px, 360px)', gap: '2rem', alignItems: 'start' }}>
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              <SummaryRow icon="✉️" label="Email address" value="stephen.b@gmail.com" editLabel="Edit email" />
              <SummaryRow icon="💳" label="Payment method" value="Mastercard" editLabel="Edit payment" />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Personal details</h1>
            <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem' }}>
              Please enter your details below – all fields are required. We only ask for the essentials to process your order.
            </p>
            <form onSubmit={submit} noValidate>
              {['firstName', 'lastName', 'street', 'houseNumber', 'city', 'postalCode'].map((field) => (
                <div className="form-field" key={field} style={{ marginBottom: '1rem' }}>
                  <label htmlFor={field}>{labelFor(field)}</label>
                  <input
                    id={field}
                    name={field}
                    autoComplete={autocompleteFor(field)}
                    value={form[field]}
                    aria-invalid={!!errors[field]}
                    aria-describedby={errors[field] ? `${field}-err` : undefined}
                    onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                  />
                  {errors[field] && (
                    <span id={`${field}-err`} className="form-error" role="alert">
                      {errors[field]}
                    </span>
                  )}
                </div>
              ))}
              <div className="form-field" style={{ marginBottom: '1rem' }}>
                <label htmlFor="country">Country</label>
                <select id="country" value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}>
                  <option>Netherlands</option>
                  <option>Germany</option>
                </select>
              </div>
              <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                <input type="checkbox" checked={form.saveInfo} onChange={(e) => setForm((f) => ({ ...f, saveInfo: e.target.checked }))} />
                Save your information for next purchase
              </label>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', maxWidth: 480 }} disabled={pending}>
                {pending ? 'Processing…' : 'Continue'}
              </button>
            </form>
          </div>
          <aside
            style={{ background: 'var(--gray-100)', borderRadius: 'var(--radius-xl)', padding: '1.5rem' }}
            aria-labelledby="order-summary-title"
          >
            <h2 id="order-summary-title" style={{ marginTop: 0, fontSize: '1.25rem' }}>
              Order Summary
            </h2>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
              <div className="provider-card" style={{ width: 72, height: 48, background: '#0066cc', fontSize: '0.65rem', borderRadius: 8, aspectRatio: 'auto' }}>
                LEBARA
              </div>
              <span style={{ fontWeight: 700 }}>Lebara Germany</span>
            </div>
            <dl style={{ margin: 0, fontSize: '0.9375rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <dt>
                  {cart.quantity}× {cart.title}
                </dt>
                <dd style={{ margin: 0 }}>{totals.subtotal.toFixed(2)}CZK</dd>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--gray-700)' }}>
                <dt>Service fee ⓘ</dt>
                <dd style={{ margin: 0 }}>{totals.serviceFee.toFixed(2)}CZK</dd>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.125rem', borderTop: '1px solid #ddd', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
                <dt>Total</dt>
                <dd style={{ margin: 0 }}>{totals.total.toFixed(2)}CZK</dd>
              </div>
            </dl>
            <button type="button" className="btn btn-outline" style={{ width: '100%', marginTop: '1rem', background: 'transparent', border: 'none', color: '#2563eb', fontWeight: 600 }}>
              Have a discount code? ▾
            </button>
          </aside>
        </div>
      </main>
    </>
  );
}

function SummaryRow({ icon, label, value, editLabel }) {
  return (
    <div style={{ background: 'var(--gray-100)', borderRadius: 'var(--radius-lg)', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <span aria-hidden="true">{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{label}</div>
        <div style={{ fontWeight: 600 }}>{value}</div>
      </div>
      <button type="button" style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontWeight: 600 }}>
        {editLabel}
      </button>
    </div>
  );
}

function labelFor(field) {
  const map = {
    firstName: 'First name',
    lastName: 'Last name',
    street: 'Street',
    houseNumber: 'House number',
    city: 'City',
    postalCode: 'Postal code',
  };
  return map[field];
}

function autocompleteFor(field) {
  const map = {
    firstName: 'given-name',
    lastName: 'family-name',
    street: 'street-address',
    houseNumber: 'off',
    city: 'address-level2',
    postalCode: 'postal-code',
  };
  return map[field];
}
