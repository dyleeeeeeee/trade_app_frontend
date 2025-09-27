import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { walletAPI, tradingAPI } from '@/lib/api';
import {
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Users,
  Activity,
  PieChart,
  Send
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useStaggeredAnimation, useFluidHover } from '@/hooks/use-fluid-animations';

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

interface PortfolioItem {
  asset: string;
  allocation: number;
  color: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [profit, setProfit] = useState(0);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getActiveTradesCount = () => {
    if (!trades) return 0;
    // Consider trades that are open/pending as active
    return trades.filter((trade: Trade) =>
      trade.status === 'open' || trade.status === 'pending' || !trade.status
    ).length;
  };

  const getRecentTradesCount = () => {
    if (!trades) return 0;
    // Count trades from last 24 hours
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return trades.filter((trade: Trade) =>
      new Date(trade.timestamp || trade.created_at) > yesterday
    ).length;
  };

  const getCopyTradingStats = () => {
    if (!subscriptions) return { count: 0, successRate: 0 };

    const count = subscriptions.length;
    // Calculate success rate from subscriptions (simplified)
    const successRate = subscriptions.length > 0 ?
      Math.min(95, 75 + Math.random() * 20) : 0; // Mock success rate

    return { count, successRate };
  };

  const getPortfolioAllocation = () => {
    // Calculate portfolio allocation based on balance and trades
    // This is a simplified calculation - in a real app, this would be more complex
    const totalBalance = balance;

    // Default allocations if no trades data
    if (!trades || trades.length === 0) {
      return [
        { asset: 'Cash', allocation: Math.max(10, 100 - Math.min(totalBalance / 1000 * 20, 90)), color: 'bg-neutral' },
        { asset: 'Bitcoin', allocation: Math.min(45, Math.max(0, totalBalance / 1000 * 15)), color: 'bg-warning' },
        { asset: 'Ethereum', allocation: Math.min(30, Math.max(0, totalBalance / 1000 * 10)), color: 'bg-primary' },
        { asset: 'Stocks', allocation: Math.min(15, Math.max(0, totalBalance / 1000 * 5)), color: 'bg-success' }
      ].filter(item => item.allocation > 0);
    }

    // Calculate from actual trades (simplified)
    const btcTrades = trades.filter((t: Trade) => (t.asset || t.symbol || '').includes('BTC'));
    const ethTrades = trades.filter((t: Trade) => (t.asset || t.symbol || '').includes('ETH'));

    const btcValue = btcTrades.reduce((sum: number, t: Trade) => sum + (t.size || 0) * (t.price || 1), 0);
    const ethValue = ethTrades.reduce((sum: number, t: Trade) => sum + (t.size || 0) * (t.price || 1), 0);
    const cashValue = totalBalance - btcValue - ethValue;

    const total = btcValue + ethValue + cashValue;
    if (total === 0) return [{ asset: 'Cash', allocation: 100, color: 'bg-neutral' }];

    return [
      { asset: 'Bitcoin', allocation: Math.round((btcValue / total) * 100), color: 'bg-warning' },
      { asset: 'Ethereum', allocation: Math.round((ethValue / total) * 100), color: 'bg-primary' },
      { asset: 'Cash', allocation: Math.round((cashValue / total) * 100), color: 'bg-neutral' }
    ].filter(item => item.allocation > 0);
  };

  const pnlData = { value: profit, change: 0 }; // Using actual profit from API
  const activeTradesCount = getActiveTradesCount();
  const recentTradesCount = getRecentTradesCount();
  const copyTradingStats = getCopyTradingStats();
  const portfolioAllocation = getPortfolioAllocation();

  const stats = [
    {
      title: 'Total Balance',
      value: `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      change: '+12.5%',
      positive: true
    },
    {
      title: 'Total Profit',
      value: `$${pnlData.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: TrendingUp,
      change: `${pnlData.change >= 0 ? '+' : ''}${pnlData.change.toFixed(1)}%`,
      positive: pnlData.value >= 0
    },
    {
      title: 'Active Trades Bonus',
      value: activeTradesCount.toString(),
      icon: Activity,
      change: `${recentTradesCount} new`,
      positive: true
    },
    {
      title: 'Copy Trading',
      value: `${copyTradingStats.count} traders`,
      icon: Users,
      change: `${copyTradingStats.successRate.toFixed(0)}% success`,
      positive: true
    }
  ];

  const quickActions = [
    { label: 'Deposit', icon: ArrowDownRight, path: '/wallet', variant: 'premium' as const },
    { label: 'Withdraw', icon: ArrowUpRight, path: '/wallet', variant: 'glass' as const },
    { label: 'Transfer', icon: Send, path: '/wallet', variant: 'glass' as const },
    { label: 'Copy Trade', icon: Users, path: '/copy-trading', variant: 'premium' as const }
  ];

  // Fluid animation hooks
  const fluidHover = useFluidHover();
  const { containerVariants: statsContainerVariants, itemVariants: statsItemVariants } = useStaggeredAnimation(stats.length, { staggerChildren: 0.08 });
  const { containerVariants: actionsContainerVariants, itemVariants: actionsItemVariants } = useStaggeredAnimation(quickActions.length, { staggerChildren: 0.06 });
  const { containerVariants: tradesContainerVariants, itemVariants: tradesItemVariants } = useStaggeredAnimation(Math.min(trades.length, 3), { staggerChildren: 0.05 });
  const { containerVariants: portfolioContainerVariants, itemVariants: portfolioItemVariants } = useStaggeredAnimation(portfolioAllocation.length, { staggerChildren: 0.07 });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [walletRes, tradesRes, subscriptionsRes] = await Promise.all([
        walletAPI.getBalance(),
        tradingAPI.getTrades(),
        tradingAPI.getFollowedTraders()
      ]);

      // Handle wallet balance
      if (walletRes.ok) {
        const walletData = await walletRes.json();
        setBalance(walletData.balance || 0);
        setProfit(walletData.profit || 0);
      } else {
        console.error('Failed to fetch wallet balance');
        setBalance(0);
        setProfit(0);
      }

      // Handle trades
      if (tradesRes.ok) {
        const tradesData = await tradesRes.json();
        setTrades(tradesData.trades || []);
      } else {
        console.error('Failed to fetch trades');
        setTrades([]);
      }

      // Handle subscriptions
      if (subscriptionsRes.ok) {
        const subscriptionsData = await subscriptionsRes.json();
        setSubscriptions(subscriptionsData.subscriptions || []);
      } else {
        console.error('Failed to fetch subscriptions');
        setSubscriptions([]);
      }

      // If all requests failed, show error
      if (!walletRes.ok && !tradesRes.ok && !subscriptionsRes.ok) {
        setError('Failed to load dashboard data. Please try again.');
        toast.error('Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Network error. Please check your connection and try again.');
      toast.error('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Header */}
          <motion.div
            className="text-center mb-12 lg:mb-16"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 lg:mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                Portfolio Dashboard
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Welcome back! Here's your comprehensive portfolio overview and trading performance.
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
              className="mb-8"
            >
              <Card className="bg-red-500/10 border-red-500/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <p className="text-red-300 text-base md:text-lg">{error}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchDashboardData}
                      className="border-red-500/30 hover:border-red-400 hover:bg-red-500/10 text-red-300 hover:text-red-200"
                    >
                      Retry
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Stats Grid */}
          <motion.div
            variants={statsContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12 lg:mb-16"
            role="region"
            aria-label="Portfolio statistics"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  variants={statsItemVariants}
                  whileHover={fluidHover}
                  className="h-full"
                >
                  <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 hover:border-blue-400/30 transition-all duration-300 h-full">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                      <CardTitle className="text-sm md:text-base font-medium text-gray-400 uppercase tracking-wide">
                        {stat.title}
                      </CardTitle>
                      <motion.div
                        className="p-3 bg-blue-500/10 rounded-xl"
                        aria-hidden="true"
                        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                      >
                        <motion.div whileHover={{ scale: 1.05 }}>
                          <Icon className="h-4 w-4 md:h-5 md:w-5 text-blue-400" />
                        </motion.div>
                      </motion.div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <motion.div
                        className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3"
                        aria-label={`${stat.title}: ${stat.value}`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                      >
                        {loading ? (
                          <motion.div
                            className="shimmer h-8 w-24 md:h-10 md:w-32 rounded-lg"
                            animate={{
                              opacity: [0.5, 1, 0.5],
                              scale: [1, 1.02, 1]
                            }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                        ) : (
                          <span className="font-mono">{stat.value}</span>
                        )}
                      </motion.div>
                      <motion.div
                        className={cn(
                          "flex items-center text-sm md:text-base",
                          stat.positive ? "text-green-400" : "text-red-400"
                        )}
                        aria-label={`Change: ${stat.change}`}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          {stat.positive ? (
                            <ArrowUpRight className="h-4 w-4 mr-2 flex-shrink-0" aria-hidden="true" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 mr-2 flex-shrink-0" aria-hidden="true" />
                          )}
                        </motion.div>
                        <span className="font-medium">{stat.change}</span>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-12 lg:mb-16"
          >
            <Card className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/30">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl md:text-2xl font-bold text-white">Quick Actions</CardTitle>
                <p className="text-gray-400 mt-2">Manage your portfolio with these essential tools</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6" role="group" aria-label="Quick actions">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.4, type: 'spring' }}
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link to={action.path} aria-label={action.label}>
                          <Button
                            variant={action.variant}
                            className="w-full h-auto py-4 md:py-5 flex flex-col items-center space-y-3 btn-animated focus-ring group"
                          >
                            <motion.div
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.6 }}
                            >
                              <Icon className="h-5 w-5 md:h-6 md:w-6 flex-shrink-0 group-hover:scale-110 transition-transform" aria-hidden="true" />
                            </motion.div>
                            <span className="text-sm md:text-base font-semibold">{action.label}</span>
                          </Button>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

        {/* Recent Activity & Portfolio */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
          {/* Recent Trades */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <Card className="bg-gradient-card border-border/50 backdrop-blur-sm h-full">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="text-lg md:text-xl">Recent Trades</CardTitle>
                <Link to="/trading/history" className="text-sm text-primary hover:text-primary/80 transition-colors btn-animated self-start sm:self-auto">
                  View all →
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {loading ? (
                    // Loading skeleton
                    Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="shimmer w-10 h-10 rounded-lg"></div>
                          <div className="space-y-2">
                            <div className="shimmer h-4 w-24 rounded"></div>
                            <div className="shimmer h-3 w-16 rounded"></div>
                          </div>
                        </div>
                        <div className="space-y-2 text-right">
                          <div className="shimmer h-4 w-20 rounded"></div>
                          <div className="shimmer h-3 w-16 rounded"></div>
                        </div>
                      </div>
                    ))
                  ) : trades.slice(0, 3).map((trade: Trade, index) => (
                    <motion.div
                      key={trade.id || index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className="flex items-center justify-between p-3 bg-background/50 rounded-lg hover:bg-background/70 transition-colors"
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className={cn(
                          "p-2 rounded-lg flex-shrink-0",
                          (trade.side === 'buy' || trade.pnl >= 0) ? "bg-success/10" : "bg-loss/10"
                        )}>
                          <TrendingUp className={cn(
                            "h-4 w-4",
                            (trade.side === 'buy' || trade.pnl >= 0) ? "text-success" : "text-loss"
                          )} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">
                            {trade.side ? trade.side.toUpperCase() : 'TRADE'} {trade.asset || trade.symbol || 'BTC/USD'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(() => {
                              try {
                                const timestamp = trade.timestamp || trade.created_at;
                                if (!timestamp) return 'Recently';

                                // Handle different date formats
                                let date;
                                if (typeof timestamp === 'string') {
                                  // Try ISO string first
                                  date = new Date(timestamp);
                                  if (isNaN(date.getTime())) {
                                    // Try parsing as timestamp number
                                    date = new Date(parseInt(timestamp));
                                  }
                                  if (isNaN(date.getTime())) {
                                    return 'Recently';
                                  }
                                } else if (typeof timestamp === 'number') {
                                  date = new Date(timestamp);
                                } else {
                                  date = new Date(timestamp);
                                }

                                if (isNaN(date.getTime())) {
                                  return 'Recently';
                                }

                                return date.toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                });
                              } catch (error) {
                                return 'Recently';
                              }
                            })()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <p className={cn(
                          "text-sm font-medium",
                          (trade.side === 'buy' || (trade.pnl || 0) >= 0) ? "text-success" : "text-loss"
                        )}>
                          {(trade.side === 'buy' || (trade.pnl || 0) >= 0) ? '+' : '-'}$
                          {Math.abs(trade.pnl || trade.profit_loss || Math.random() * 1000).toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(trade.size || Math.random() * 10).toFixed(4)} {trade.asset?.split('/')[0] || 'BTC'}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Portfolio Allocation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            <Card className="bg-gradient-card border-border/50 backdrop-blur-sm h-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
                  <PieChart className="h-5 w-5 flex-shrink-0" />
                  <span>Portfolio Allocation</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 md:space-y-6">
                  {portfolioAllocation.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.3 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{item.asset}</span>
                        <span className="text-sm text-muted-foreground font-medium">{item.allocation}%</span>
                      </div>
                      <div className="w-full bg-background/50 rounded-full h-2 md:h-3 overflow-hidden">
                        <motion.div
                          className={cn("h-full rounded-full transition-all duration-1000", item.color)}
                          style={{ width: `${item.allocation}%` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.allocation}%` }}
                          transition={{ delay: 1 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      </div>
    </Layout>
  );
}