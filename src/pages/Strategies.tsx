import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  TrendingUp,
  Activity,
  DollarSign,
  BarChart3,
  Zap,
  Shield,
  Target,
  Cpu,
  Bitcoin,
  LineChart,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { strategyAPI } from '@/lib/api';

// Mock performance data
const generatePerformanceData = () => {
  const data = [];
  let value = 10000;
  for (let i = 0; i < 30; i++) {
    value = value + (Math.random() - 0.45) * 500;
    data.push({
      day: i + 1,
      value: Math.max(8000, value)
    });
  }
  return data;
};

interface Strategy {
  id: number;
  name: string;
  description: string;
  category: 'crypto' | 'quant';
  risk_level: 'low' | 'medium' | 'high';
  expected_roi: number;
  min_investment: number;
  max_investment?: number;
  subscriber_count: number;
  total_invested: number;
  isSubscribed?: boolean;
}

interface MyStrategy {
  subscription_id: number;
  strategy_id: number;
  strategy_name: string;
  description: string;
  category: string;
  risk_level: string;
  expected_roi: number;
  invested_amount: number;
  total_earnings: number;
  days_active: number;
  subscribed_at: string;
}

export default function Strategies() {
  const { toast } = useToast();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [myStrategies, setMyStrategies] = useState<MyStrategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<number | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchStrategies();
    fetchMyStrategies();
  }, []);

  const fetchStrategies = async () => {
    try {
      const response = await strategyAPI.getStrategies();
      if (response.ok) {
        const data = await response.json();
        setStrategies(data.strategies);
      } else {
        toast({
          title: "Couldn't load strategies",
          description: "Something went wrong. Refresh to try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Connection problem",
        description: "Check your network and try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMyStrategies = async () => {
    try {
      const response = await strategyAPI.getMyStrategies();
      if (response.ok) {
        const data = await response.json();
        setMyStrategies(data.strategies);
      }
    } catch (error) {
      console.error('Failed to load my strategies:', error);
    }
  };

  const handleSubscribe = async (strategy: Strategy) => {
    if (!investmentAmount || parseFloat(investmentAmount) <= 0) {
      toast({
        title: "Enter an amount",
        description: "Add how much you'd like to invest to continue.",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(investmentAmount);
    if (amount < strategy.min_investment) {
      toast({
        title: "Amount too low",
        description: `This strategy starts at $${strategy.min_investment}.`,
        variant: "destructive"
      });
      return;
    }

    if (strategy.max_investment && amount > strategy.max_investment) {
      toast({
        title: "Amount too high",
        description: `This strategy accepts up to $${strategy.max_investment}.`,
        variant: "destructive"
      });
      return;
    }

    setSubscribing(strategy.id);
    try {
      const response = await strategyAPI.subscribeToStrategy(strategy.id, amount);
      if (response.ok) {
        toast({
          title: "You're subscribed",
          description: `${strategy.name} is now active in your portfolio.`,
        });
        setDialogOpen(false);
        setInvestmentAmount('');
        setSelectedStrategy(null);
        fetchMyStrategies();
        fetchStrategies(); // Refresh strategy data to update subscriber counts
      } else {
        const error = await response.json();
        toast({
          title: "Couldn't subscribe",
          description: error.error || "Something went wrong. Try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Connection problem",
        description: "Check your network and try again.",
        variant: "destructive"
      });
    } finally {
      setSubscribing(null);
    }
  };

  const handleUnsubscribe = async (strategyId: number, strategyName: string) => {
    try {
      const response = await strategyAPI.unsubscribeFromStrategy(strategyId);
      if (response.ok) {
        toast({
          title: "Unsubscribed",
          description: `You've left ${strategyName}.`,
        });
        fetchMyStrategies();
        fetchStrategies();
      } else {
        const error = await response.json();
        toast({
          title: "Couldn't unsubscribe",
          description: error.error || "Something went wrong. Try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Connection problem",
        description: "Check your network and try again.",
        variant: "destructive"
      });
    }
  };

  const getIcon = (category: string, riskLevel: string) => {
    if (category === 'crypto') {
      switch (riskLevel) {
        case 'high': return Zap;
        case 'medium': return Shield;
        default: return DollarSign;
      }
    } else {
      switch (riskLevel) {
        case 'high': return Cpu;
        case 'medium': return TrendingUp;
        default: return BarChart3;
      }
    }
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'success' as const;
      case 'medium':
        return 'warning' as const;
      case 'high':
        return 'error' as const;
      default:
        return 'neutral' as const;
    }
  };

  const StrategyCard = ({ strategy }: { strategy: Strategy }) => {
    const Icon = getIcon(strategy.category, strategy.risk_level);
    const isSubscribed = myStrategies.some(s => s.strategy_id === strategy.id);

    return (
      <Card interactive className="flex flex-col p-6">
        <div className="flex items-start justify-between">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-interactive/15"
            aria-hidden="true"
          >
            <Icon className="h-5 w-5 text-interactive" strokeWidth={1.5} />
          </span>
          <Badge variant={getRiskBadgeVariant(strategy.risk_level)}>
            {strategy.risk_level} risk
          </Badge>
        </div>

        <div className="mt-4 flex flex-col gap-1.5">
          <h3 className="text-h3">{strategy.name}</h3>
          <p className="text-body-sm text-text-secondary">{strategy.description}</p>
        </div>

        {/* Performance Chart Placeholder */}
        <div className="mt-5 flex h-32 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
          <div className="text-center text-text-tertiary">
            <LineChart className="mx-auto mb-2 h-6 w-6" strokeWidth={1.5} />
            <p className="text-caption">Performance history coming soon</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-3">
            <p className="text-caption uppercase text-text-tertiary">Daily ROI</p>
            <p
              className={cn(
                'mt-1 font-mono tabular-nums text-body-sm font-semibold',
                strategy.expected_roi > 1 ? 'text-feedback-success' : 'text-text-primary',
              )}
            >
              {strategy.expected_roi.toFixed(2)}%
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-3">
            <p className="text-caption uppercase text-text-tertiary">Minimum</p>
            <p className="mt-1 font-mono tabular-nums text-body-sm font-semibold text-text-primary">
              ${strategy.min_investment.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-3">
            <p className="text-caption uppercase text-text-tertiary">Members</p>
            <p className="mt-1 font-mono tabular-nums text-body-sm font-semibold text-text-primary">
              {strategy.subscriber_count}
            </p>
          </div>
        </div>

        {/* Subscribe Button */}
        <div className="mt-5">
          {isSubscribed ? (
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => handleUnsubscribe(strategy.id, strategy.name)}
              aria-label={`Unsubscribe from ${strategy.name}`}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Subscribed
            </Button>
          ) : (
            <Button
              className="w-full"
              onClick={() => {
                setSelectedStrategy(strategy);
                setInvestmentAmount('');
                setDialogOpen(true);
              }}
              aria-label={`Subscribe to ${strategy.name}`}
            >
              Subscribe
            </Button>
          )}
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-interactive" />
        </div>
      </Layout>
    );
  }

  const cryptoStrategies = strategies.filter(s => s.category === 'crypto');
  const quantStrategies = strategies.filter(s => s.category === 'quant');

  const overviewStats = [
    {
      label: 'Active strategies',
      value: `${myStrategies.length}`,
      icon: Target,
      tone: 'neutral' as const,
    },
    {
      label: 'Total invested',
      value: `$${myStrategies.reduce((sum, s) => sum + s.invested_amount, 0).toLocaleString()}`,
      icon: DollarSign,
      tone: 'neutral' as const,
    },
    {
      label: 'Total earnings',
      value: `+$${myStrategies.reduce((sum, s) => sum + s.total_earnings, 0).toFixed(2)}`,
      icon: TrendingUp,
      tone: 'success' as const,
    },
    {
      label: 'Avg. daily ROI',
      value: `${
        myStrategies.length > 0
          ? (myStrategies.reduce((sum, s) => sum + s.expected_roi, 0) / myStrategies.length).toFixed(2)
          : '0.00'
      }%`,
      icon: Activity,
      tone: 'neutral' as const,
    },
  ];

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <header className="flex flex-col gap-1">
          <p className="text-caption uppercase text-text-tertiary">Automated investing</p>
          <h1 className="text-h1">Strategies</h1>
          <p className="text-body text-text-secondary">
            Put your money to work with automated crypto and quant strategies.
          </p>
        </header>

        {/* My Strategies Summary */}
        {myStrategies.length > 0 && (
          <Card className="p-6">
            <CardHeader className="p-0">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-interactive" strokeWidth={1.5} />
                <span>Your strategies</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {myStrategies.map((strategy) => (
                  <div
                    key={strategy.subscription_id}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-5"
                  >
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <h4 className="text-body font-semibold text-text-primary">
                        {strategy.strategy_name}
                      </h4>
                      <Badge variant={getRiskBadgeVariant(strategy.risk_level)}>
                        {strategy.risk_level}
                      </Badge>
                    </div>
                    <dl className="flex flex-col gap-2 text-body-sm">
                      <div className="flex items-center justify-between">
                        <dt className="text-text-tertiary">Invested</dt>
                        <dd className="font-mono tabular-nums font-medium text-text-primary">
                          ${strategy.invested_amount.toLocaleString()}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-text-tertiary">Earnings</dt>
                        <dd className="font-mono tabular-nums font-medium text-feedback-success">
                          +${strategy.total_earnings.toFixed(2)}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-text-tertiary">Days active</dt>
                        <dd className="font-mono tabular-nums font-medium text-text-primary">
                          {strategy.days_active}
                        </dd>
                      </div>
                    </dl>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mt-4 w-full"
                      onClick={() => handleUnsubscribe(strategy.strategy_id, strategy.strategy_name)}
                      aria-label={`Unsubscribe from ${strategy.strategy_name}`}
                    >
                      Unsubscribe
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <section
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
          aria-label="Strategy portfolio overview"
        >
          {overviewStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} interactive className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-caption uppercase text-text-tertiary">{stat.label}</p>
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-interactive/10"
                    aria-hidden="true"
                  >
                    <Icon className="h-5 w-5 text-interactive" strokeWidth={1.5} />
                  </span>
                </div>
                <p
                  className={cn(
                    'mt-4 font-mono tabular-nums text-h2',
                    stat.tone === 'success' ? 'text-feedback-success' : 'text-text-primary',
                  )}
                >
                  {stat.value}
                </p>
              </Card>
            );
          })}
        </section>

        {/* Strategy Tabs */}
        <Tabs defaultValue="crypto" className="flex flex-col gap-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="crypto" className="flex items-center gap-2">
              <Bitcoin className="h-4 w-4" />
              Crypto
            </TabsTrigger>
            <TabsTrigger value="quant" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              Quant
            </TabsTrigger>
          </TabsList>

          <TabsContent value="crypto" className="flex flex-col gap-6">
            {cryptoStrategies.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {cryptoStrategies.map((strategy) => (
                  <StrategyCard key={strategy.id} strategy={strategy} />
                ))}
              </div>
            ) : (
              <Card className="p-10 text-center">
                <p className="text-body-sm text-text-tertiary">
                  No crypto strategies available right now. Check back soon.
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="quant" className="flex flex-col gap-6">
            {quantStrategies.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {quantStrategies.map((strategy) => (
                  <StrategyCard key={strategy.id} strategy={strategy} />
                ))}
              </div>
            ) : (
              <Card className="p-10 text-center">
                <p className="text-body-sm text-text-tertiary">
                  No quant strategies available right now. Check back soon.
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Subscription Dialog */}
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setSelectedStrategy(null);
            setInvestmentAmount('');
          }
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Subscribe to {selectedStrategy?.name}</DialogTitle>
              <CardDescription>Choose how much to invest. You can unsubscribe anytime.</CardDescription>
            </DialogHeader>
            {selectedStrategy && (
              <div className="flex flex-col gap-4">
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4">
                  <p className="text-caption uppercase text-text-tertiary">Strategy details</p>
                  <div className="mt-3 grid grid-cols-2 gap-4 text-body-sm">
                    <div>
                      <p className="text-text-tertiary">Target daily ROI</p>
                      <p className="mt-0.5 font-mono tabular-nums font-medium text-text-primary">
                        {selectedStrategy.expected_roi.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-text-tertiary">Risk level</p>
                      <p className="mt-0.5 font-medium capitalize text-text-primary">
                        {selectedStrategy.risk_level}
                      </p>
                    </div>
                    <div>
                      <p className="text-text-tertiary">Minimum</p>
                      <p className="mt-0.5 font-mono tabular-nums font-medium text-text-primary">
                        ${selectedStrategy.min_investment.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-text-tertiary">Maximum</p>
                      <p className="mt-0.5 font-mono tabular-nums font-medium text-text-primary">
                        {selectedStrategy.max_investment ? `$${selectedStrategy.max_investment.toLocaleString()}` : 'No limit'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="investment">Amount to invest ($)</Label>
                  <Input
                    id="investment"
                    type="number"
                    placeholder={`Min: $${selectedStrategy.min_investment}`}
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    min={selectedStrategy.min_investment}
                    max={selectedStrategy.max_investment}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => handleSubscribe(selectedStrategy)}
                    disabled={subscribing === selectedStrategy.id}
                  >
                    {subscribing === selectedStrategy.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Subscribing
                      </>
                    ) : (
                      'Confirm and invest'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
