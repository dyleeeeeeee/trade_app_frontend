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
  PieChart,
  Send,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { usePrices } from '@/hooks/use-prices';
import { LivePrice, PriceChange } from '@/components/LivePrice';
import { LiveMarketChart } from '@/components/LiveMarketChart';

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

export default function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [profit, setProfit] = useState(0);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Live market prices, polled every 15s and shared across the app.
  const { data: prices } = usePrices();

  useEffect(() => {
    fetchDashboardData();
    // Keep the wallet balance and trades live without a loading flicker.
    const interval = setInterval(() => fetchDashboardData({ silent: true }), 15_000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getActiveTradesCount = () => {
    if (!trades) return 0;
    return trades.filter((trade: Trade) =>
      trade.status === 'open' || trade.status === 'pending' || !trade.status
    ).length;
  };

  const getRecentTradesCount = () => {
    if (!trades) return 0;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return trades.filter((trade: Trade) =>
      new Date(trade.timestamp || trade.created_at) > yesterday
    ).length;
  };

  const getCopyTradingStats = () => {
    if (!subscriptions) return { count: 0 };
    return { count: subscriptions.length };
  };

  const getPortfolioAllocation = () => {
    const totalBalance = balance;

    if (!trades || trades.length === 0) {
      return [
        { asset: 'Cash', symbol: 'CASH', allocation: Math.max(10, 100 - Math.min(totalBalance / 1000 * 20, 90)), brandColor: '#64748b' },
        { asset: 'Bitcoin', symbol: 'BTC/USD', allocation: Math.min(45, Math.max(0, totalBalance / 1000 * 15)), brandColor: '#F7931A' },
        { asset: 'Ethereum', symbol: 'ETH/USD', allocation: Math.min(30, Math.max(0, totalBalance / 1000 * 10)), brandColor: '#627EEA' },
        { asset: 'Stocks', symbol: 'NVDA', allocation: Math.min(15, Math.max(0, totalBalance / 1000 * 5)), brandColor: '#76B900' }
      ].filter(item => item.allocation > 0);
    }

    const btcTrades = trades.filter((t: Trade) => (t.asset || t.symbol || '').includes('BTC'));
    const ethTrades = trades.filter((t: Trade) => (t.asset || t.symbol || '').includes('ETH'));

    const btcValue = btcTrades.reduce((sum: number, t: Trade) => sum + (t.size || 0) * (t.price || 1), 0);
    const ethValue = ethTrades.reduce((sum: number, t: Trade) => sum + (t.size || 0) * (t.price || 1), 0);
    const cashValue = totalBalance - btcValue - ethValue;

    const total = btcValue + ethValue + cashValue;
    if (total === 0) return [{ asset: 'Cash', symbol: 'CASH', allocation: 100, brandColor: '#64748b' }];

    return [
      { asset: 'Bitcoin', symbol: 'BTC/USD', allocation: Math.round((btcValue / total) * 100), brandColor: '#F7931A' },
      { asset: 'Ethereum', symbol: 'ETH/USD', allocation: Math.round((ethValue / total) * 100), brandColor: '#627EEA' },
      { asset: 'Cash', symbol: 'CASH', allocation: Math.round((cashValue / total) * 100), brandColor: '#64748b' }
    ].filter(item => item.allocation > 0);
  };

  const activeTradesCount = getActiveTradesCount();
  const recentTradesCount = getRecentTradesCount();
  const copyTradingStats = getCopyTradingStats();
  const portfolioAllocation = getPortfolioAllocation();

  // Featured asset for the live chart + honest, data-derived market insights.
  const featuredAsset = prices?.find((p) => p.symbol === 'BTC/USD') ?? prices?.[0];
  const topMover = prices && prices.length
    ? [...prices].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))[0]
    : undefined;
  const insights = [
    topMover && {
      text: `${topMover.name} is the day's biggest move at ${topMover.changePercent >= 0 ? '+' : ''}${topMover.changePercent.toFixed(2)}%.`,
    },
    featuredAsset && {
      text: `Bitcoin is ${featuredAsset.changePercent >= 0 ? 'up' : 'down'} ${Math.abs(featuredAsset.changePercent).toFixed(2)}% from its previous close.`,
    },
    {
      text: profit >= 0
        ? `Your portfolio is in profit by $${profit.toLocaleString('en-US', { maximumFractionDigits: 0 })}.`
        : `Your portfolio is down $${Math.abs(profit).toLocaleString('en-US', { maximumFractionDigits: 0 })} — consider reviewing your positions.`,
    },
  ].filter(Boolean) as { text: string }[];

  const stats = [
    {
      title: 'Total Balance',
      value: `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      change: profit !== 0 ? `${profit >= 0 ? '+' : ''}$${Math.abs(profit).toLocaleString('en-US', { maximumFractionDigits: 0 })} P&L` : '—',
      positive: profit >= 0,
    },
    {
      title: 'Total Profit',
      value: `$${profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: TrendingUp,
      change: profit !== 0 ? (profit >= 0 ? 'Profitable' : 'In loss') : '—',
      positive: profit >= 0,
    },
    {
      title: 'Active Trades',
      value: activeTradesCount.toString(),
      icon: Activity,
      change: recentTradesCount > 0 ? `${recentTradesCount} today` : '—',
      positive: true,
    },
    {
      title: 'Copy Trading',
      value: `${copyTradingStats.count} traders`,
      icon: Users,
      change: copyTradingStats.count > 0 ? 'Active' : 'None',
      positive: copyTradingStats.count > 0,
    },
  ];

  const quickActions = [
    { label: 'Deposit', icon: ArrowDownRight, path: '/wallet', variant: 'primary' as const },
    { label: 'Withdraw', icon: ArrowUpRight, path: '/wallet', variant: 'secondary' as const },
    { label: 'Transfer', icon: Send, path: '/wallet', variant: 'secondary' as const },
    { label: 'Copy Trade', icon: Users, path: '/copy-trading', variant: 'secondary' as const },
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
        const walletData = await walletRes.json();
        setBalance(walletData.balance || 0);
        setProfit(walletData.profit || 0);
      } else {
        console.error('Failed to fetch wallet balance');
        setBalance(0);
        setProfit(0);
      }

      if (tradesRes.ok) {
        const tradesData = await tradesRes.json();
        setTrades(tradesData.trades || []);
      } else {
        console.error('Failed to fetch trades');
        setTrades([]);
      }

      if (subscriptionsRes.ok) {
        const subscriptionsData = await subscriptionsRes.json();
        setSubscriptions(subscriptionsData.subscriptions || []);
      } else {
        console.error('Failed to fetch subscriptions');
        setSubscriptions([]);
      }

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
      const timestamp = trade.timestamp || trade.created_at;
      if (!timestamp) return 'Recently';
      const date = new Date(typeof timestamp === 'string' ? timestamp : Number(timestamp));
      if (isNaN(date.getTime())) return 'Recently';
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-12">
        {/* Header */}
        <header className="flex flex-col gap-1">
          <h1 className="text-h1">Dashboard</h1>
          <p className="text-body text-text-secondary">
            Welcome back — here's your portfolio at a glance.
          </p>
        </header>

        {/* Error */}
        {error && (
          <Card className="border-feedback-error/30 bg-feedback-error/10 p-4">
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-body-sm text-feedback-error">{error}</p>
              <Button variant="secondary" size="sm" onClick={() => fetchDashboardData()}>Retry</Button>
            </div>
          </Card>
        )}

        {/* Stats */}
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" aria-label="Portfolio statistics">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const neutral = stat.change === '—';
            return (
              <Card key={stat.title} interactive className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-caption uppercase text-text-tertiary">{stat.title}</p>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-interactive/10" aria-hidden="true">
                    <Icon className="h-5 w-5 text-interactive" strokeWidth={1.5} />
                  </span>
                </div>
                <p className="mt-4 font-mono text-h2 text-text-primary" aria-label={`${stat.title}: ${stat.value}`}>
                  {loading ? (
                    <span className="shimmer inline-block h-7 w-28 rounded-md bg-surface-overlay/60" />
                  ) : (
                    stat.value
                  )}
                </p>
                <div
                  className={cn(
                    'mt-2 flex items-center gap-1 text-body-sm',
                    neutral ? 'text-text-tertiary' : stat.positive ? 'text-feedback-success' : 'text-feedback-error',
                  )}
                >
                  {!neutral && (
                    stat.positive
                      ? <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                      : <ArrowDownRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </Card>
            );
          })}
        </section>

        {/* Live Markets — polled every 15s */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-caption uppercase text-text-tertiary">Live Markets</h2>
            <span className="flex items-center gap-2 text-caption text-text-tertiary">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-feedback-success opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-feedback-success" />
              </span>
              Real-time
            </span>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {(prices && prices.length > 0 ? prices.slice(0, 6) : Array.from({ length: 6 })).map((asset: any, i: number) => (
              <div key={asset?.symbol ?? i} className="flex items-center gap-3 rounded-xl border border-hairline/[0.08] bg-surface-overlay/40 p-3">
                {asset ? (
                  <>
                    <AssetLogo symbol={asset.symbol} size={32} />
                    <div className="min-w-0">
                      <p className="truncate text-caption font-semibold text-text-primary">{asset.symbol}</p>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <LivePrice value={Number(asset.price)} className="font-mono text-body-sm text-text-secondary" />
                        <PriceChange changePercent={asset.changePercent} />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-8 w-full animate-pulse rounded-md bg-surface-overlay" />
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Live chart + AI insights */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-2">
            <h2 className="text-caption uppercase text-text-tertiary">Market trend</h2>
            <div className="mt-4">
              <LiveMarketChart asset={featuredAsset} />
            </div>
          </Card>

          {/* AI insights — glass spotlight */}
          <Card className="relative overflow-hidden p-6">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-interactive/20 blur-3xl" aria-hidden="true" />
            <div className="relative flex flex-col gap-4">
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
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-4 w-full animate-pulse rounded bg-white/[0.06]" />
                  ))}
                </div>
              )}
              <p className="mt-1 text-caption text-text-tertiary">
                Generated from live market data. Not financial advice.
              </p>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3">Quick actions</h2>
            <p className="text-body-sm text-text-secondary">Manage your portfolio with these essential tools.</p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4" role="group" aria-label="Quick actions">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.label}
                  asChild
                  variant={action.variant}
                  className="h-auto flex-col gap-2 py-5"
                >
                  <Link to={action.path} aria-label={action.label}>
                    <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                    <span className="text-body-sm font-semibold">{action.label}</span>
                  </Link>
                </Button>
              );
            })}
          </div>
        </Card>

        {/* Recent Activity & Portfolio */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Recent Trades */}
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-h3">Recent trades</CardTitle>
              <Link to="/trading" className="text-body-sm text-interactive transition-colors hover:text-interactive-hover">
                View all
              </Link>
            </CardHeader>
            <CardContent className="flex-1">
              {loading ? (
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-center justify-between rounded-xl border border-hairline/[0.08] p-3">
                      <div className="flex items-center gap-3">
                        <div className="shimmer h-9 w-9 rounded-lg bg-surface-overlay/60" />
                        <div className="flex flex-col gap-2">
                          <div className="shimmer h-4 w-24 rounded bg-surface-overlay/60" />
                          <div className="shimmer h-3 w-16 rounded bg-surface-overlay/60" />
                        </div>
                      </div>
                      <div className="shimmer h-4 w-20 rounded bg-surface-overlay/60" />
                    </div>
                  ))}
                </div>
              ) : trades.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-12 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-hairline/[0.08] bg-surface-overlay/60">
                    <Activity className="h-6 w-6 text-text-tertiary" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <p className="text-body-sm font-medium text-text-primary">No trades yet</p>
                  <p className="max-w-xs text-body-sm text-text-secondary">Your executed trades will appear here once you start trading.</p>
                  <Button asChild variant="secondary" size="sm" className="mt-1">
                    <Link to="/trading">Start trading</Link>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {trades.slice(0, 3).map((trade: Trade, index) => (
                    <div
                      key={trade.id || index}
                      className="flex items-center justify-between rounded-xl border border-hairline/[0.08] bg-surface-overlay/40 p-3 transition-colors duration-micro hover:bg-surface-overlay/70"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <AssetLogo symbol={trade.asset || trade.symbol || 'BTC/USD'} size={28} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-body-sm font-semibold text-text-primary">
                            {trade.side ? trade.side.toUpperCase() : 'TRADE'} {(trade.asset || trade.symbol || 'BTC/USD').replace('/USD', '')}
                          </p>
                          <p className="text-caption text-text-tertiary">{formatTradeTime(trade)}</p>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 text-right">
                        <p className={cn('font-mono text-body-sm font-semibold', trade.side === 'buy' ? 'text-feedback-success' : 'text-feedback-error')}>
                          {trade.side === 'buy' ? '-' : '+'}$
                          {((trade.size || 0) * (trade.price || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className="font-mono text-caption text-text-tertiary">
                          {(trade.size || 0).toFixed(4)} {(trade.asset || 'BTC/USD').split('/')[0]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Portfolio Allocation */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-h3">
                <PieChart className="h-5 w-5 text-text-tertiary" strokeWidth={1.5} aria-hidden="true" />
                Portfolio allocation
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex flex-col gap-5">
                {portfolioAllocation.map((item: any, index: number) => (
                  <div key={index} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        {item.symbol !== 'CASH' ? (
                          <AssetLogo symbol={item.symbol} size={20} />
                        ) : (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-surface-overlay">
                            <DollarSign className="h-3 w-3 text-text-tertiary" strokeWidth={1.5} aria-hidden="true" />
                          </span>
                        )}
                        <span className="text-body-sm font-medium text-text-primary">{item.asset}</span>
                      </div>
                      <span className="font-mono text-body-sm font-semibold text-text-primary">{item.allocation}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-overlay">
                      <div
                        className="h-full rounded-full transition-[width] duration-layout ease-standard"
                        style={{ width: `${item.allocation}%`, backgroundColor: item.brandColor }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
