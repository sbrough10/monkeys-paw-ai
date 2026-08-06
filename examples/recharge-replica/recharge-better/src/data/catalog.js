export const POPULAR_BRANDS = [
  { id: 'apple', name: 'Apple Gift Card', category: 'shopping', bg: '#e8e8ed', label: 'Apple' },
  { id: 'eplus', name: 'E-Plus', category: 'mobile', bg: '#1b5e20', label: 'e-plus+' },
  { id: 'lyca', name: 'Lycamobile', category: 'mobile', bg: '#1a237e', label: 'Lyca Mobile' },
  { id: 'paysafe', name: 'PaysafeCard', category: 'payment', bg: '#0288d1', label: 'PaysafeCard' },
  { id: 'amazon', name: 'Amazon', category: 'shopping', bg: '#111', label: 'amazon' },
  { id: 'google', name: 'Google Play', category: 'entertainment', bg: '#fff', label: 'Google Play', border: true },
];

export const DE_PROVIDERS = [
  { slug: 'eplus', name: 'E-Plus', bg: '#1b5e20', text: 'e-plus+' },
  { slug: 'lycamobile', name: 'Lycamobile', bg: '#1a237e', text: 'Lyca Mobile' },
  { slug: 'telekom', name: 'Telekom', bg: '#e20074', text: 'T' },
  { slug: 'lebara', name: 'Lebara', bg: '#0066cc', text: 'LEBARA' },
  { slug: 'vodafone', name: 'Vodafone', bg: '#e60000', text: 'vodafone' },
  { slug: 'libon', name: 'Libon', bg: '#00897b', text: 'libon' },
  { slug: 'o2', name: 'O2', bg: 'linear-gradient(135deg,#0066cc,#00bcd4)', text: 'O2' },
  { slug: 'blau', name: 'Blau', bg: '#b3e5fc', text: 'blau', dark: true },
  { slug: 'aldi', name: 'ALDI TALK', bg: '#ffeb3b', text: 'ALDI TALK', dark: true },
  { slug: 'ayyildiz', name: 'Ay Yildiz', bg: '#c62828', text: 'Ay Yildiz' },
  { slug: 'bildmobil', name: 'Bildmobil', bg: '#eceff1', text: 'Bildmobil', dark: true },
  { slug: 'blauworld', name: 'Blauworld', bg: '#1565c0', text: 'Blauworld' },
  { slug: 'congstar', name: 'congstar', bg: '#111', text: 'congstar' },
  { slug: 'fonic', name: 'FONIC', bg: '#cfd8dc', text: 'FONIC', dark: true },
  { slug: 'fyve', name: 'FYVE', bg: '#43a047', text: 'FYVE' },
  { slug: 'klarmobil', name: 'klarmobil.de', bg: '#827717', text: 'klarmobil' },
  { slug: 'mobi', name: 'mobi', bg: '#eeeeee', text: 'mobi', dark: true },
  { slug: 'ortel', name: 'ortel mobile', bg: '#fff', text: 'ortel', border: true, dark: true },
];

export const LEBARA_PRODUCTS = {
  bundle: [
    {
      id: 'hello-m',
      title: 'Lebara Hello M',
      bullets: ['13 GB Data', '150 Minutes', 'Valid for 28 days'],
      priceCzk: 388.19,
      eurLabel: '14.99 EUR',
    },
    {
      id: 'hello-xl',
      title: 'Lebara Hello XL',
      bullets: ['22 GB Data', '500 Minutes', 'Valid for 28 days'],
      priceCzk: 647.15,
      eurLabel: '24.99 EUR',
    },
  ],
  call: [
    { id: 'top-10', title: 'Lebara top up 10 EUR', bullets: [], priceCzk: 258.96, eurLabel: '10 EUR' },
    { id: 'top-15', title: 'Lebara top up 15 EUR', bullets: [], priceCzk: 388.45, eurLabel: '15 EUR' },
    { id: 'top-20', title: 'Lebara top up 20 EUR', bullets: [], priceCzk: 517.92, eurLabel: '20 EUR' },
    { id: 'top-30', title: 'Lebara top up 30 EUR', bullets: [], priceCzk: 776.88, eurLabel: '30 EUR' },
  ],
  data: [
    { id: 'data-5', title: 'Lebara Data 5 GB', bullets: ['5 GB Data', 'Valid for 28 days'], priceCzk: 310.0, eurLabel: '12 EUR' },
  ],
  international: [
    { id: 'intl-1', title: 'Lebara International S', bullets: ['300 international minutes'], priceCzk: 420.0, eurLabel: '16 EUR' },
  ],
};

export const SERVICE_FEE_CZK = 69.66;
export const CART_STORAGE_KEY = 'recharge_cart';

export function getProvider(slug) {
  return DE_PROVIDERS.find((p) => p.slug === slug);
}

export function findProduct(productId) {
  for (const group of Object.values(LEBARA_PRODUCTS)) {
    const found = group.find((p) => p.id === productId);
    if (found) return found;
  }
  return null;
}
