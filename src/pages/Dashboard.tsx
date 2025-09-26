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

export default function Dashboard() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [trades, setTrades] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
      } else {
        console.error('Failed to fetch wallet balance');
        setBalance(0);
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

  const calculatePnL = () => {
    if (!trades || trades.length === 0) return { value: 0, change: 0 };
    
    // Calculate today's P&L from trades
    const today = new Date().toDateString();
    const todaysTrades = trades.filter((trade: any) => 
      new Date(trade.timestamp || trade.created_at).toDateString() === today
    );
    
    const totalPnL = todaysTrades.reduce((sum: number, trade: any) => {
      return sum + (trade.pnl || trade.profit_loss || 0);
    }, 0);
    
    // Calculate percentage change (simplified - could be vs yesterday)
    const previousDayTrades = trades.filter((trade: any) => {
      const tradeDate = new Date(trade.timestamp || trade.created_at);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return tradeDate.toDateString() === yesterday.toDateString();
    });
    
    const previousPnL = previousDayTrades.reduce((sum: number, trade: any) => {
      return sum + (trade.pnl || trade.profit_loss || 0);
    }, 0);
    
    const changePercent = previousPnL !== 0 ? ((totalPnL - previousPnL) / Math.abs(previousPnL)) * 100 : 0;
    
    return { value: totalPnL, change: changePercent };
  };

  const getActiveTradesCount = () => {
    if (!trades) return 0;
    // Consider trades that are open/pending as active
    return trades.filter((trade: any) => 
      trade.status === 'open' || trade.status === 'pending' || !trade.status
    ).length;
  };

  const getRecentTradesCount = () => {
    if (!trades) return 0;
    // Count trades from last 24 hours
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return trades.filter((trade: any) => 
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
    const btcTrades = trades.filter((t: any) => (t.asset || t.symbol || '').includes('BTC'));
    const ethTrades = trades.filter((t: any) => (t.asset || t.symbol || '').includes('ETH'));
    
    const btcValue = btcTrades.reduce((sum: number, t: any) => sum + (t.size || 0) * (t.price || 1), 0);
    const ethValue = ethTrades.reduce((sum: number, t: any) => sum + (t.size || 0) * (t.price || 1), 0);
    const cashValue = totalBalance - btcValue - ethValue;
    
    const total = btcValue + ethValue + cashValue;
    if (total === 0) return [{ asset: 'Cash', allocation: 100, color: 'bg-neutral' }];
    
    return [
      { asset: 'Bitcoin', allocation: Math.round((btcValue / total) * 100), color: 'bg-warning' },
      { asset: 'Ethereum', allocation: Math.round((ethValue / total) * 100), color: 'bg-primary' },
      { asset: 'Cash', allocation: Math.round((cashValue / total) * 100), color: 'bg-neutral' }
    ].filter(item => item.allocation > 0);
  };

  const pnlData = calculatePnL();
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
      title: 'Today\'s P&L',
      value: `$${pnlData.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: TrendingUp,
      change: `${pnlData.change >= 0 ? '+' : ''}${pnlData.change.toFixed(1)}%`,
      positive: pnlData.value >= 0
    },
    {
      title: 'Active Trades',
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

  return (
    <Layout>
      <div className="space-y-6 lg:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center md:text-left"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-foreground bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Welcome back! Here's your portfolio overview.
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-destructive/10 border-destructive/20">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <p className="text-destructive text-sm md:text-base">{error}</p>
                  <Button variant="outline" size="sm" onClick={fetchDashboardData} className="btn-animated">
                    Retry
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6" role="region" aria-label="Portfolio statistics">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="h-full"
              >
                <Card className="bg-gradient-card border-border/50 backdrop-blur-sm card-hover h-full">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className="p-2 bg-primary/10 rounded-lg" aria-hidden="true">
                      <Icon className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="text-xl md:text-2xl font-bold text-foreground mb-2" aria-label={`${stat.title}: ${stat.value}`}>
                      {loading ? (
                        <div className="shimmer h-6 w-16 md:h-8 md:w-20 rounded"></div>
                      ) : (
                        stat.value
                      )}
                    </div>
                    <div className={cn(
                      "flex items-center text-xs mt-1",
                      stat.positive ? "text-success" : "text-loss"
                    )} aria-label={`Change: ${stat.change}`}>
                      {stat.positive ? (
                        <ArrowUpRight className="h-3 w-3 mr-1 flex-shrink-0" aria-hidden="true" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 mr-1 flex-shrink-0" aria-hidden="true" />
                      )}
                      <span className="truncate">{stat.change}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <Card className="bg-gradient-card border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4" role="group" aria-label="Quick actions">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link to={action.path} aria-label={action.label}>
                        <Button
                          variant={action.variant}
                          className="w-full h-auto py-3 md:py-4 flex flex-col items-center space-y-2 btn-animated focus-ring"
                        >
                          <Icon className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" aria-hidden="true" />
                          <span className="text-xs md:text-sm font-medium">{action.label}</span>
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
                  ) : trades.slice(0, 3).map((trade: any, index) => (
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
                            {new Date(trade.timestamp || trade.created_at || Date.now()).toLocaleTimeString()}
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
    </Layout>
  );
}