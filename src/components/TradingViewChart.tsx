import * as React from 'react';

declare global {
  interface Window {
    TradingView?: any;
  }
}

/**
 * Maps our backend asset symbols to real TradingView symbols (live data from
 * TradingView's own feed — exchange-grade, not the 30s yfinance snapshot).
 *
 * SpaceX went public on NASDAQ on 2026-06-12 under ticker SPCX, so it is now a
 * genuinely real, live-priced equity — charted as NASDAQ:SPCX like any other.
 */
export const TV_SYMBOL: Record<string, string> = {
  'BTC/USD': 'BINANCE:BTCUSDT',
  'ETH/USD': 'BINANCE:ETHUSDT',
  AAPL: 'NASDAQ:AAPL',
  GOOGL: 'NASDAQ:GOOGL',
  NVDA: 'NASDAQ:NVDA',
  TSLA: 'NASDAQ:TSLA',
  META: 'NASDAQ:META',
  AMZN: 'NASDAQ:AMZN',
  SPACEX: 'NASDAQ:SPCX',
  SPCX: 'NASDAQ:SPCX',
};

export function tvSymbolFor(symbol: string): string {
  return TV_SYMBOL[symbol] ?? `NASDAQ:${symbol.replace('/USD', '')}`;
}

let scriptPromise: Promise<void> | null = null;
function loadTradingView(): Promise<void> {
  if (window.TradingView) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://s3.tradingview.com/tv.js';
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load TradingView'));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

interface TradingViewChartProps {
  /** Our backend symbol, e.g. "BTC/USD" or "AAPL". */
  symbol: string;
  interval?: string;
  className?: string;
}

/**
 * TradingView Advanced Real-Time Chart — real candlesticks, timeframes,
 * indicators and live exchange data. Recreated whenever the symbol changes.
 */
export function TradingViewChart({ symbol, interval = 'D', className }: TradingViewChartProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const idRef = React.useRef(`tv_${Math.abs(hashCode(symbol))}_${interval}`);
  const [status, setStatus] = React.useState<'loading' | 'ready' | 'error'>('loading');

  const tvSymbol = tvSymbolFor(symbol);

  React.useEffect(() => {
    let cancelled = false;
    const id = `tv_${Date.now()}`;
    idRef.current = id;

    loadTradingView()
      .then(() => {
        if (cancelled || !containerRef.current || !window.TradingView) return;
        containerRef.current.innerHTML = `<div id="${id}" style="height:100%;width:100%"></div>`;
        // eslint-disable-next-line new-cap
        new window.TradingView.widget({
          autosize: true,
          symbol: tvSymbol,
          interval,
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1', // candles
          locale: 'en',
          toolbar_bg: 'rgba(0,0,0,0)',
          enable_publishing: false,
          hide_top_toolbar: false,
          hide_legend: false,
          allow_symbol_change: false,
          save_image: false,
          backgroundColor: 'rgba(13, 17, 28, 0)',
          gridColor: 'rgba(255,255,255,0.05)',
          container_id: id,
        });
        setStatus('ready');
      })
      .catch(() => !cancelled && setStatus('error'));

    return () => {
      cancelled = true;
    };
  }, [tvSymbol, interval]);

  return (
    <div className={className}>
      <div ref={containerRef} className="h-full w-full overflow-hidden rounded-xl" aria-label={`${symbol} price chart`} />
      {status === 'error' && (
        <div className="flex h-full items-center justify-center text-body-sm text-text-tertiary">
          Chart unavailable right now.
        </div>
      )}
    </div>
  );
}

function hashCode(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return h;
}
