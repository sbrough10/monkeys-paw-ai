import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MobileTopUpPage from './pages/MobileTopUpPage';
import ProviderPage from './pages/ProviderPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage, { HelpPage, BrandPage } from './pages/ConfirmationPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mobile-top-up" element={<MobileTopUpPage />} />
        <Route path="/mobile-top-up/:slug" element={<ProviderPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/brand/:id" element={<BrandPage />} />
      </Routes>
    </BrowserRouter>
  );
}
