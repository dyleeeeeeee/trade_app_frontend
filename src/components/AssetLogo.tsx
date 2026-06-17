interface AssetLogoProps {
  symbol: string;
  size?: number;
  className?: string;
}

export function AssetLogo({ symbol, size = 32, className = '' }: AssetLogoProps) {
  const key = symbol.replace('/USD', '').toUpperCase();
  const Logo = LOGOS[key] || LOGOS['DEFAULT'];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <Logo />
    </svg>
  );
}

export const BRAND_COLORS: Record<string, string> = {
  BTC: '#F7931A',
  ETH: '#627EEA',
  AAPL: '#A2AAAD',
  GOOGL: '#4285F4',
  NVDA: '#76B900',
  TSLA: '#CC0000',
  META: '#0668E1',
  AMZN: '#FF9900',
  SPACEX: '#FFFFFF',
};

export function getAssetColor(symbol: string): string {
  const key = symbol.replace('/USD', '').toUpperCase();
  return BRAND_COLORS[key] || '#60a5fa';
}

const LOGOS: Record<string, () => JSX.Element> = {
  BTC: () => (
    <>
      <circle cx="16" cy="16" r="16" fill="#F7931A" />
      <path
        d="M22.5 14.2c.3-2-1.2-3.1-3.3-3.8l.7-2.7-1.6-.4-.7 2.7c-.4-.1-.9-.2-1.3-.3l.7-2.7-1.6-.4-.7 2.7c-.3-.1-.7-.2-1-.2l-2.2-.6-.4 1.7s1.2.3 1.2.3c.7.2.8.6.8 1l-.8 3.2c0 0 .1 0 .1 0l-.1 0-1.1 4.5c-.1.2-.3.5-.8.4 0 0-1.2-.3-1.2-.3l-.8 1.8 2.1.5c.4.1.8.2 1.2.3l-.7 2.7 1.6.4.7-2.7c.4.1.9.2 1.3.3l-.7 2.7 1.6.4.7-2.7c2.8.5 5 .3 5.9-2.2.7-2 0-3.2-1.5-3.9 1.1-.3 1.9-1 2.1-2.5zm-3.7 5.2c-.5 2-4 .9-5.1.7l.9-3.7c1.1.3 4.7.8 4.2 3zm.5-5.3c-.5 1.8-3.3.9-4.3.7l.8-3.3c1 .2 4 .7 3.5 2.6z"
        fill="white"
      />
    </>
  ),
  ETH: () => (
    <>
      <circle cx="16" cy="16" r="16" fill="#627EEA" />
      <path d="M16 4v8.9l7.5 3.3L16 4z" fill="white" fillOpacity="0.6" />
      <path d="M16 4L8.5 16.2l7.5-3.3V4z" fill="white" />
      <path d="M16 22v6l7.5-10.4L16 22z" fill="white" fillOpacity="0.6" />
      <path d="M16 28v-6l-7.5-4.4L16 28z" fill="white" />
      <path d="M16 20.8l7.5-4.6L16 12.9v7.9z" fill="white" fillOpacity="0.2" />
      <path d="M8.5 16.2l7.5 4.6v-7.9l-7.5 3.3z" fill="white" fillOpacity="0.6" />
    </>
  ),
  AAPL: () => (
    <>
      <circle cx="16" cy="16" r="16" fill="#1C1C1E" />
      <path
        d="M21.8 17.1c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.6.9-.7 0-1.9-.8-3.1-.8-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.3 1.2 9.6.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.4 0 1.8.8 3.1.8 1.3 0 2.1-1.2 2.9-2.4.9-1.4 1.3-2.7 1.3-2.8 0 0-2.6-1-2.6-4zm-2.4-7.4c.7-.8 1.1-2 1-3.1-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.6 2.9-1.4z"
        fill="white"
      />
    </>
  ),
  GOOGL: () => (
    <>
      <circle cx="16" cy="16" r="16" fill="#FFFFFF" />
      <path d="M23.7 16.2c0-.6-.1-1.2-.2-1.8H16v3.4h4.3c-.2 1-.7 1.9-1.5 2.5v2.1h2.5c1.4-1.3 2.3-3.3 2.3-5.6l.1-.6z" fill="#4285F4" />
      <path d="M16 24c2 0 3.7-.7 5-1.8l-2.5-1.9c-.7.5-1.5.7-2.5.7-1.9 0-3.5-1.3-4.1-3H9.3v2c1.3 2.6 3.9 4 6.7 4z" fill="#34A853" />
      <path d="M11.9 18c-.2-.5-.2-1-.2-1.6 0-.5.1-1.1.2-1.6v-2H9.3c-.7 1.3-1 2.8-1 4.3 0 1.5.4 2.9 1 4.2l2.6-2v-.3z" fill="#FBBC05" />
      <path d="M16 11.4c1.1 0 2.1.4 2.8 1.1l2.1-2.1C19.7 9.2 18 8.4 16 8.4c-2.8 0-5.4 1.6-6.7 4l2.6 2c.6-1.7 2.2-3 4.1-3z" fill="#EA4335" />
    </>
  ),
  NVDA: () => (
    <>
      <circle cx="16" cy="16" r="16" fill="#000000" />
      <path
        d="M12.3 13.5v-1.2c.1 0 .2 0 .3-.1 2.2-.3 3.9.8 5.3 2.4.3.3.5.7.8 1.1-1 .1-1.8.1-2.5.5-.2-.3-.4-.6-.6-.8-.9-1.1-2-1.7-3.3-1.9zm0 2.5v-1.3c1.4.2 2.3 1 3 2.2.3.5.5 1.1.7 1.7l-1.2.4c-.3-1.4-1.1-2.4-2.5-3zm7.4-1.8c-.4-.5-.8-1-1.2-1.5-1.6-1.7-3.5-2.8-5.9-2.6-.1 0-.2 0-.3 0v-1.4h.2c3.1-.2 5.6 1 7.6 3.4.2.3.5.6.7.9l-1.1 1.2zm-7.4 4.3v-1.2c1.8.3 2.7 1.7 3.1 3.4l-1.2.4c-.2-1.2-.8-2.1-1.9-2.6zm-1.3 4.3v-8.5c-.1 0-.2 0-.2 0-1 .1-1.7.6-2.2 1.4-.6 1-.7 2.1-.4 3.2.4 1.4 1.4 2.3 2.8 2.7v1.3c-2.1-.3-3.6-1.6-4.2-3.7-.5-1.6-.3-3.2.6-4.6.7-1.1 1.7-1.7 3-1.9.2 0 .4 0 .6-.1v-2.3h.5c3.5-.1 6.3 1.4 8.5 4.1l.4.5-2.3 2.5c-.7.8-1.4 1.5-2.1 2.3-.8-.1-1.3.2-1.7.7-.5.6-.5 1.3-.1 2l-1.2.6c-.6-.9-.8-1.8-.5-2.8.1-.2.1-.4.2-.5-.5-.1-.9-.3-1.2-.5l-.5.7z"
        fill="#76B900"
      />
    </>
  ),
  TSLA: () => (
    <>
      <circle cx="16" cy="16" r="16" fill="#CC0000" />
      <path
        d="M16 7L16 25M16 7C14.5 7 10 7.8 8 9L9.5 11C11 10.2 13.5 9.5 16 9.5C18.5 9.5 21 10.2 22.5 11L24 9C22 7.8 17.5 7 16 7Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </>
  ),
  META: () => (
    <>
      <circle cx="16" cy="16" r="16" fill="#0668E1" />
      <path
        d="M9.5 16c0-2.5.8-4.5 1.8-5.5.7-.7 1.4-1 2.2-1 1.2 0 2.2.9 3.2 2.5l.3.5.3-.5c1-1.6 2-2.5 3.2-2.5.8 0 1.5.3 2.2 1 1 1 1.8 3 1.8 5.5 0 2.5-.8 4.5-1.8 5.5-.7.7-1.4 1-2.2 1-1.2 0-2.2-.9-3.2-2.5l-.3-.5-.3.5c-1 1.6-2 2.5-3.2 2.5-.8 0-1.5-.3-2.2-1-1-1-1.8-3-1.8-5.5z"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
      />
    </>
  ),
  AMZN: () => (
    <>
      <circle cx="16" cy="16" r="16" fill="#232F3E" />
      <path
        d="M10 18.5c0 0 1.5 1.5 4 2.5 2.5 1 5 1 5 1"
        stroke="#FF9900"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M21 20l1.5 1.5-1.5 1"
        stroke="#FF9900"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M11 17c0-3.3 2.2-6 5-6s5 2.7 5 6"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M13 15.5c.5-1.5 1.5-2.5 3-2.5s2.5 1 3 2.5"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </>
  ),
  SPACEX: () => (
    <>
      <circle cx="16" cy="16" r="16" fill="#0B0E11" />
      <path
        d="M8 22L16 10L24 22H20L16 15L12 22H8Z"
        fill="white"
      />
      <path
        d="M13 22L16 17L19 22H13Z"
        fill="#0B0E11"
      />
    </>
  ),
  DEFAULT: () => (
    <>
      <circle cx="16" cy="16" r="16" fill="#334155" />
      <circle cx="16" cy="16" r="6" stroke="#94a3b8" strokeWidth="2" fill="none" />
      <circle cx="16" cy="16" r="2" fill="#94a3b8" />
    </>
  ),
};
