import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { walletAPI, tradingAPI } from '@/lib/api';
import { AssetLogo } from '@/components/AssetLogo';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Users,
  Activity,
  Send,
  Sparkles,
  Wallet,
} from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { usePrices } from '@/hooks/use-prices';
import { LivePrice, PriceChange } from '@/components/LivePrice';
import { TradingViewChart } from '@/components/TradingViewChart';
import { TradingViewTicker } from '@/components/TradingViewTicker';

interface Trade {
  id?: string;
  side?: 'buy' | 'sell';
  asset?: string;
  symbol?: string;
  pnl?: number;
  profit_loss?: number;
  size?: number;
  price?: number;
  timestamp?: string | number;
  created_at?: string | number;
  status?: string;
}

interface Subscription {
  id?: string;
  trader_id?: string;
  success_rate?: number;
}

const TIMEFRAMES = [
  { label: '1H', value: '60' },
  { label: '1D', value: 'D' },
  { label: '1W', value: 'W' },
  { label: '1M', value: 'M' },
] as const;

const money = (n: number, max = 2) =>
  n.toLocaleString('en-US', { minimumFractionDigits: max, maximumFractionDigits: max });

export default function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [profit, setProfit] = useState(0);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartSymbol, setChartSymbol] = useState('BTC/USD');
  const [chartInterval, setChartInterval] = useState<string>('D');

  // Live market prices — shared, deduped, visibility-aware query.
  const { data: prices } = usePrices();

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(() => fetchDashboardData({ silent: true }), 15_000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getActiveTradesCount = () => {
    if (!trades) return 0;
    return trades.filter((t: Trade) => t.status === 'open' || t.status === 'pending' || !t.status).length;
  };

  const getRecentTradesCount = () => {
    if (!trades) return 0;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return trades.filter((t: Trade) => new Date(t.timestamp || t.created_at) > yesterday).length;
  };

  const getPortfolioAllocation = () => {
    const totalBalance = balance;
    if (!trades || trades.length === 0) {
      return [
        { asset: 'Cash', symbol: 'CASH', allocation: Math.max(10, 100 - Math.min((totalBalance / 1000) * 20, 90)), brandColor: '#8A93A6' },
        { asset: 'Bitcoin', symbol: 'BTC/USD', allocation: Math.min(45, Math.max(0, (totalBalance / 1000) * 15)), brandColor: '#F7931A' },
        { asset: 'Ethereum', symbol: 'ETH/USD', allocation: Math.min(30, Math.max(0, (totalBalance / 1000) * 10)), brandColor: '#627EEA' },
        { asset: 'Stocks', symbol: 'NVDA', allocation: Math.min(15, Math.max(0, (totalBalance / 1000) * 5)), brandColor: '#76B900' },
      ].filter((i) => i.allocation > 0);
    }
    const btcTrades = trades.filter((t: Trade) => (t.asset || t.symbol || '').includes('BTC'));
    const ethTrades = trades.filter((t: Trade) => (t.asset || t.symbol || '').includes('ETH'));
    const btcValue = btcTrades.reduce((s: number, t: Trade) => s + (t.size || 0) * (t.price || 1), 0);
    const ethValue = ethTrades.reduce((s: number, t: Trade) => s + (t.size || 0) * (t.price || 1), 0);
    const cashValue = totalBalance - btcValue - ethValue;
    const total = btcValue + ethValue + cashValue;
    if (total === 0) return [{ asset: 'Cash', symbol: 'CASH', allocation: 100, brandColor: '#8A93A6' }];
    return [
      { asset: 'Bitcoin', symbol: 'BTC/USD', allocation: Math.round((btcValue / total) * 100), brandColor: '#F7931A' },
      { asset: 'Ethereum', symbol: 'ETH/USD', allocation: Math.round((ethValue / total) * 100), brandColor: '#627EEA' },
      { asset: 'Cash', symbol: 'CASH', allocation: Math.round((cashValue / total) * 100), brandColor: '#8A93A6' },
    ].filter((i) => i.allocation > 0);
  };

  const activeTradesCount = getActiveTradesCount();
  const recentTradesCount = getRecentTradesCount();
  const copyCount = subscriptions?.length ?? 0;
  const portfolioAllocation = getPortfolioAllocation();

  const selectedPrice = prices?.find((p) => p.symbol === chartSymbol) ?? prices?.[0];
  const featuredAsset = prices?.find((p) => p.symbol === 'BTC/USD') ?? prices?.[0];
  const topMover = prices && prices.length
    ? [...prices].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))[0]
    : undefined;

  const insights = [
    topMover && { text: `${topMover.name} is the day's biggest move at ${topMover.changePercent >= 0 ? '+' : ''}${topMover.changePercent.toFixed(2)}%.` },
    featuredAsset && { text: `Bitcoin is ${featuredAsset.changePercent >= 0 ? 'up' : 'down'} ${Math.abs(featuredAsset.changePercent).toFixed(2)}% from its previous close.` },
    {
      text: profit >= 0
        ? `Your portfolio is in profit by $${money(profit, 0)}.`
        : `Your portfolio is down $${money(Math.abs(profit), 0)} — consider reviewing your positions.`,
    },
  ].filter(Boolean) as { text: string }[];

  const stats = [
    { title: 'Total balance', value: `$${money(balance)}`, icon: DollarSign, change: profit !== 0 ? `${profit >= 0 ? '+' : ''}$${money(Math.abs(profit), 0)} P&L` : '—', positive: profit >= 0 },
    { title: 'Total profit', value: `$${money(profit)}`, icon: TrendingUp, change: profit !== 0 ? (profit >= 0 ? 'Profitable' : 'In loss') : '—', positive: profit >= 0 },
    { title: 'Active trades', value: activeTradesCount.toString(), icon: Activity, change: recentTradesCount > 0 ? `${recentTradesCount} today` : '—', positive: true },
    { title: 'Copy trading', value: `${copyCount} traders`, icon: Users, change: copyCount > 0 ? 'Active' : 'None', positive: copyCount > 0 },
  ];

  const quickActions = [
    { label: 'Deposit', icon: ArrowDownRight, path: '/wallet', variant: 'primary' as const },
    { label: 'Withdraw', icon: ArrowUpRight, path: '/wallet', variant: 'secondary' as const },
    { label: 'Transfer', icon: Send, path: '/wallet', variant: 'secondary' as const },
    { label: 'Copy trade', icon: Users, path: '/copy-trading', variant: 'secondary' as const },
  ];

  const fetchDashboardData = async ({ silent = false }: { silent?: boolean } = {}) => {
    try {
      if (!silent) {
        setLoading(true);
        setError(null);
      }
      const [walletRes, tradesRes, subscriptionsRes] = await Promise.all([
        walletAPI.getBalance(),
        tradingAPI.getTrades(),
        tradingAPI.getFollowedTraders(),
      ]);
      if (walletRes.ok) {
        const w = await walletRes.json();
        setBalance(w.balance || 0);
        setProfit(w.profit || 0);
      } else {
        setBalance(0);
        setProfit(0);
      }
      if (tradesRes.ok) {
        const d = await tradesRes.json();
        setTrades(d.trades || []);
      } else setTrades([]);
      if (subscriptionsRes.ok) {
        const d = await subscriptionsRes.json();
        setSubscriptions(d.subscriptions || []);
      } else setSubscriptions([]);
      if (!walletRes.ok && !tradesRes.ok && !subscriptionsRes.ok) {
        setError('Failed to load dashboard data. Please try again.');
        toast.error('Failed to load dashboard data');
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      if (!silent) {
        setError('Network error. Please check your connection and try again.');
        toast.error('Network error. Please check your connection.');
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const formatTradeTime = (trade: Trade) => {
    try {
      const ts = trade.timestamp || trade.created_at;
      if (!ts) return 'Recently';
      const d = new Date(typeof ts === 'string' ? ts : Number(ts));
      if (isNaN(d.getTime())) return 'Recently';
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Recently';
    }
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <header className="flex flex-wrap items-end justify-between gap-2">
          <div className="flex flex-col gap-1">
            <span className="text-caption uppercase text-text-tertiary">{today}</span>
            <h1 className="text-h1">Portfolio</h1>
          </div>
          <div className="flex items-center gap-2 rounded-full glass px-3 py-1.5">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-feedback-success opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-feedback-success" />
            </span>
            <span className="text-caption text-text-secondary">Live markets</span>
          </div>
        </header>

        {error && (
          <Card className="border-feedback-error/30 bg-feedback-error/10 p-4">
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-body-sm text-feedback-error">{error}</p>
              <Button variant="secondary" size="sm" onClick={() => fetchDashboardData()}>Retry</Button>
            </div>
          </Card>
        )}

        {/* KPI row */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Portfolio statistics">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const neutral = stat.change === '—';
            return (
              <Card key={stat.title} interactive className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-caption uppercase text-text-tertiary">{stat.title}</p>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-interactive/10" aria-hidden="true">
                    <Icon className="h-5 w-5 text-interactive" strokeWidth={1.5} />
                  </span>
                </div>
                <p className="mt-3 font-mono text-h2 text-text-primary" aria-label={`${stat.title}: ${stat.value}`}>
                  {loading ? <span className="shimmer inline-block h-7 w-28 rounded-md bg-white/[0.06]" /> : stat.value}
                </p>
                <div className={cn('mt-1.5 flex items-center gap-1 text-body-sm', neutral ? 'text-text-tertiary' : stat.positive ? 'text-feedback-success' : 'text-feedback-error')}>
                  {!neutral && (stat.positive ? <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" /> : <ArrowDownRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />)}
                  <span>{stat.change}</span>
                </div>
              </Card>
            );
          })}
        </section>

        {/* Live ticker tape */}
        <Card className="overflow-hidden p-0">
          <TradingViewTicker />
        </Card>

        {/* Chart + portfolio summary */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Advanced chart */}
          <Card className="flex flex-col overflow-hidden xl:col-span-2">
            <div className="liquid-glass flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] p-4">
              <div className="flex items-center gap-3">
                {selectedPrice && <AssetLogo symbol={selectedPrice.symbol} size={32} />}
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-h3 text-text-primary">{chartSymbol.replace('/USD', '')}</h2>
                    {selectedPrice && <PriceChange changePercent={selectedPrice.changePercent} />}
                  </div>
                  {selectedPrice && (
                    <LivePrice value={Number(selectedPrice.price)} className="font-mono text-body-sm text-text-secondary" />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 rounded-full glass-inset p-1" role="group" aria-label="Chart timeframe">
                {TIMEFRAMES.map((tf) => (
                  <button
                    key={tf.value}
                    onClick={() => setChartInterval(tf.value)}
                    aria-pressed={chartInterval === tf.value}
                    className={cn(
                      'rounded-full px-3 py-1 text-caption font-medium transition-colors duration-micro',
                      chartInterval === tf.value ? 'bg-interactive/15 text-interactive' : 'text-text-secondary hover:text-text-primary',
                    )}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
            </div>
            <TradingViewChart symbol={chartSymbol} interval={chartInterval} className="h-[440px] w-full" />
          </Card>

          {/* Portfolio value + allocation donut */}
          <Card className="liquid-glass flex flex-col p-6">
            <p className="text-caption uppercase text-text-tertiary">Portfolio value</p>
            <p className="mt-2 font-mono text-display text-text-primary leading-none">
              {loading ? <span className="shimmer inline-block h-12 w-40 rounded-lg bg-white/[0.06]" /> : `$${money(balance)}`}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-caption font-medium tabular-nums', profit >= 0 ? 'bg-feedback-success/15 text-feedback-success' : 'bg-feedback-error/15 text-feedback-error')}>
                {profit >= 0 ? <ArrowUpRight className="h-3 w-3" strokeWidth={2} /> : <ArrowDownRight className="h-3 w-3" strokeWidth={2} />}
                {profit >= 0 ? '+' : '-'}${money(Math.abs(profit), 0)}
              </span>
              <span className="text-caption text-text-tertiary">all-time P&L</span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl glass-inset p-3">
                <p className="flex items-center gap-1.5 text-caption text-text-tertiary"><Wallet className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" /> Buying power</p>
                <p className="mt-1 font-mono text-body-sm font-semibold text-text-primary">${money(balance, 0)}</p>
              </div>
              <div className="rounded-xl glass-inset p-3">
                <p className="flex items-center gap-1.5 text-caption text-text-tertiary"><Activity className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" /> Open positions</p>
                <p className="mt-1 font-mono text-body-sm font-semibold text-text-primary">{activeTradesCount}</p>
              </div>
            </div>

            <div className="my-5 h-px bg-white/[0.06]" />

            <p className="text-caption uppercase text-text-tertiary">Allocation</p>
            <div className="mt-3 flex items-center gap-4">
              <div className="relative h-[120px] w-[120px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie data={portfolioAllocation} dataKey="allocation" nameKey="asset" innerRadius={42} outerRadius={58} paddingAngle={2} stroke="none" startAngle={90} endAngle={-270}>
                      {portfolioAllocation.map((e, i) => <Cell key={i} fill={e.brandColor} />)}
                    </Pie>
                  </RePieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono text-body font-semibold text-text-primary">{portfolioAllocation.length}</span>
                  <span className="text-caption text-text-tertiary">assets</span>
                </div>
              </div>
              <ul className="flex flex-1 flex-col gap-2">
                {portfolioAllocation.map((item, i) => (
                  <li key={i} className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-body-sm text-text-secondary">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.brandColor }} aria-hidden="true" />
                      {item.asset}
                    </span>
                    <span className="font-mono text-body-sm font-medium text-text-primary tabular-nums">{item.allocation}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>

        {/* Watchlist + AI insights */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Watchlist drives the chart */}
          <Card className="flex flex-col xl:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-h3">Watchlist</CardTitle>
              <Link to="/trading" className="text-body-sm text-interactive transition-colors hover:text-interactive-hover">Trade</Link>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                {(prices && prices.length > 0 ? prices : Array.from({ length: 6 })).map((a: any, i: number) => {
                  if (!a) return <div key={i} className="my-1.5 h-10 animate-pulse rounded-lg bg-white/[0.05]" />;
                  const active = a.symbol === chartSymbol;
                  return (
                    <button
                      key={a.symbol}
                      onClick={() => setChartSymbol(a.symbol)}
                      aria-pressed={active}
                      className={cn(
                        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-micro',
                        active ? 'bg-interactive/10' : 'hover:bg-white/[0.05]',
                      )}
                    >
                      <AssetLogo symbol={a.symbol} size={32} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-body-sm font-semibold text-text-primary">{a.symbol.replace('/USD', '')}</p>
                        <p className="truncate text-caption text-text-tertiary">{a.name}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <LivePrice value={Number(a.price)} className="font-mono text-body-sm text-text-primary tabular-nums" />
                        <div className="w-20 text-right">
                          <PriceChange changePercent={a.changePercent} />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* AI insights spotlight */}
          <Card className="liquid-glass relative overflow-hidden p-6">
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-interactive/20 blur-3xl" aria-hidden="true" />
            <div className="relative flex h-full flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-interactive/15">
                  <Sparkles className="h-4 w-4 text-interactive" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <h2 className="text-caption uppercase text-text-tertiary">Market insights</h2>
              </div>
              {featuredAsset ? (
                <ul className="flex flex-col gap-3">
                  {insights.map((insight, i) => (
                    <li key={i} className="flex gap-2.5 text-body-sm text-text-secondary">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-interactive" aria-hidden="true" />
                      {insight.text}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-4 w-full animate-pulse rounded bg-white/[0.06]" />)}
                </div>
              )}
              <p className="mt-auto text-caption text-text-tertiary">Generated from live market data. Not financial advice.</p>
            </div>
          </Card>
        </div>

        {/* Recent activity + quick actions */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Card className="flex flex-col xl:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-h3">Recent activity</CardTitle>
              <Link to="/trading" className="text-body-sm text-interactive transition-colors hover:text-interactive-hover">View all</Link>
            </CardHeader>
            <CardContent className="flex-1">
              {loading ? (
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-center justify-between rounded-xl glass-inset p-3">
                      <div className="flex items-center gap-3">
                        <div className="shimmer h-9 w-9 rounded-lg bg-white/[0.06]" />
                        <div className="flex flex-col gap-2">
                          <div className="shimmer h-4 w-24 rounded bg-white/[0.06]" />
                          <div className="shimmer h-3 w-16 rounded bg-white/[0.06]" />
                        </div>
                      </div>
                      <div className="shimmer h-4 w-20 rounded bg-white/[0.06]" />
                    </div>
                  ))}
                </div>
              ) : trades.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-12 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl glass-inset">
                    <Activity className="h-6 w-6 text-text-tertiary" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <p className="text-body-sm font-medium text-text-primary">No trades yet</p>
                  <p className="max-w-xs text-body-sm text-text-secondary">Your executed trades will appear here once you start trading.</p>
                  <Button asChild variant="secondary" size="sm" className="mt-1"><Link to="/trading">Start trading</Link></Button>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-white/[0.06]">
                  {trades.slice(0, 5).map((trade: Trade, index) => (
                    <div key={trade.id || index} className="flex items-center justify-between gap-3 py-3 first:pt-0">
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <AssetLogo symbol={trade.asset || trade.symbol || 'BTC/USD'} size={28} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-body-sm font-semibold text-text-primary">
                            {trade.side === 'buy' ? 'Bought' : trade.side === 'sell' ? 'Sold' : 'Trade'} {(trade.asset || trade.symbol || 'BTC/USD').replace('/USD', '')}
                          </p>
                          <p className="text-caption text-text-tertiary">{formatTradeTime(trade)}</p>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 text-right">
                        <p className={cn('font-mono text-body-sm font-semibold tabular-nums', trade.side === 'buy' ? 'text-feedback-error' : 'text-feedback-success')}>
                          {trade.side === 'buy' ? '-' : '+'}${money((trade.size || 0) * (trade.price || 0))}
                        </p>
                        <p className="font-mono text-caption text-text-tertiary tabular-nums">
                          {(trade.size || 0).toFixed(4)} {(trade.asset || 'BTC/USD').split('/')[0]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card className="flex flex-col p-6">
            <h2 className="text-h3">Quick actions</h2>
            <p className="mt-1 text-body-sm text-text-secondary">Manage your funds and positions.</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button key={action.label} asChild variant={action.variant} className="h-auto flex-col gap-2 py-5">
                    <Link to={action.path} aria-label={action.label}>
                      <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                      <span className="text-body-sm font-semibold">{action.label}</span>
                    </Link>
                  </Button>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
