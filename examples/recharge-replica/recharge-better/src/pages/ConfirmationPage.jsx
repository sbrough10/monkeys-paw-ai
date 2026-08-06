import { useLocation, useNavigate } from 'react-router-dom';
import { BetterChrome } from '../components/BetterLayout';
import { useAdAssault } from '../components/AdAssault';

export default function ConfirmationPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { AdLayer, maybeAdOnClick } = useAdAssault();

  return (
    <BetterChrome assault={{ maybeAdOnClick }}>
      <AdLayer />
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="btn-error" style={{ fontSize: 40, padding: 20 }}>
          ORDER FAILED SUCCESSFULLY
        </div>
        <p>Total: {state?.total?.toFixed(2) ?? '???'} CZK — Error: none</p>
        <span onClick={() => navigate('/')} style={{ cursor: 'pointer', color: '#00f' }}>
          Click here
        </span>
      </div>
    </BetterChrome>
  );
}

export function HelpPage() {
  const { AdLayer, maybeAdOnClick } = useAdAssault();
  return (
    <BetterChrome assault={{ maybeAdOnClick }}>
      <AdLayer />
      <div className="container">Help is not available. Click here.</div>
    </BetterChrome>
  );
}

export function BrandPage() {
  const { AdLayer, maybeAdOnClick } = useAdAssault();
  return (
    <BetterChrome assault={{ maybeAdOnClick }}>
      <AdLayer />
      <div className="container">Brand stub — Click here to mobile top-up</div>
    </BetterChrome>
  );
}
