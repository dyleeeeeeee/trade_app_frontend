import * as React from 'react';

/**
 * TradingView Ticker Tape — a live, scrolling strip of real market quotes
 * across all our assets. Uses TradingView's external-embedding widget
 * (real data, transparent so the glass shows through).
 */
export function TradingViewTicker() {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const host = ref.current;
    if (!host) return;
    host.innerHTML = '<div class="tradingview-widget-container__widget"></div>';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: 'COINBASE:BTCUSD', title: 'Bitcoin' },
        { proName: 'COINBASE:ETHUSD', title: 'Ethereum' },
        { proName: 'NASDAQ:SPCX', title: 'SpaceX' },
        { proName: 'NASDAQ:NVDA', title: 'NVIDIA' },
        { proName: 'NASDAQ:AAPL', title: 'Apple' },
        { proName: 'NASDAQ:TSLA', title: 'Tesla' },
        { proName: 'NASDAQ:META', title: 'Meta' },
        { proName: 'NASDAQ:AMZN', title: 'Amazon' },
        { proName: 'NASDAQ:GOOGL', title: 'Alphabet' },
      ],
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: 'adaptive',
      colorTheme: 'dark',
      locale: 'en',
    });
    host.appendChild(script);
    return () => {
      host.innerHTML = '';
    };
  }, []);

  return <div className="tradingview-widget-container" ref={ref} />;
}
