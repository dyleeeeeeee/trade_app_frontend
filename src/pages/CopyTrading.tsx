import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { tradingAPI } from '@/lib/api';
import { toast } from 'sonner';
import {
  Users,
  Copy,
  Loader2,
  UserCheck,
  Award,
  ArrowUpRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CopyTrading() {
  const [traders, setTraders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTrader, setSelectedTrader] = useState<string | null>(null);
  const [allocation, setAllocation] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await tradingAPI.getFollowedTraders();
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data.subscriptions || []);
      }
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
    }
  };

  const handleSubscribe = async (traderId: string) => {
    if (!allocation) {
      toast.error('Enter how much of your portfolio to allocate');
      return;
    }

    setLoading(true);
    try {
      const response = await tradingAPI.subscribeToTrader(traderId, parseFloat(allocation));
      if (response.ok) {
        toast.success('You\'re now following this trader');
        setSelectedTrader(null);
        setAllocation('');
        fetchData();
      } else {
        toast.error('Couldn\'t follow this trader. Try again.');
      }
    } catch (error) {
      toast.error('Connection problem. Check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  const topTraders = [
    {
      id: 'trader1',
      name: 'Alex Chen',
      initials: 'AC',
      winRate: 78,
      totalReturn: 245.8,
      followers: 1234,
      risk: 'Medium',
      monthlyReturn: 12.5,
      trades: 342
    },
    {
      id: 'trader2',
      name: 'Sarah Williams',
      initials: 'SW',
      winRate: 82,
      totalReturn: 189.3,
      followers: 892,
      risk: 'Low',
      monthlyReturn: 8.9,
      trades: 256
    },
    {
      id: 'trader3',
      name: 'Mike Johnson',
      initials: 'MJ',
      winRate: 71,
      totalReturn: 312.7,
      followers: 2103,
      risk: 'High',
      monthlyReturn: 18.2,
      trades: 523
    }
  ];

  const riskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'success' as const;
      case 'Medium':
        return 'warning' as const;
      case 'High':
        return 'error' as const;
      default:
        return 'neutral' as const;
    }
  };

  const totalAllocated = subscriptions.reduce(
    (sum: number, sub: any) => sum + (sub.allocation || 0),
    0,
  );

  const summaryStats = [
    {
      label: 'Traders followed',
      value: `${subscriptions.length}`,
      hint: 'Active right now',
      tone: 'neutral' as const,
    },
    {
      label: 'Portfolio allocated',
      value: `${totalAllocated}%`,
      hint: 'Across followed traders',
      tone: 'neutral' as const,
    },
    {
      label: 'Average return',
      value: '+15.3%',
      hint: "Past 30 days. Past results don't guarantee future returns.",
      tone: 'success' as const,
    },
  ];

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <header className="flex flex-col gap-1">
          <p className="text-caption uppercase text-text-tertiary">Social investing</p>
          <h1 className="text-h1">Copy trading</h1>
          <p className="text-body text-text-secondary">
            Follow experienced traders and mirror their trades automatically.
          </p>
        </header>

        {/* Stats */}
        <section
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
          aria-label="Copy trading summary"
        >
          {summaryStats.map((stat) => (
            <Card key={stat.label} interactive className="min-w-0 p-4 sm:p-6">
              <p className="truncate text-caption uppercase text-text-tertiary">{stat.label}</p>
              <p
                className={cn(
                  'mt-4 truncate font-mono tabular-nums text-h2',
                  stat.tone === 'success' ? 'text-feedback-success' : 'text-text-primary',
                )}
              >
                {stat.value}
              </p>
              <p className="mt-2 text-body-sm text-text-tertiary">{stat.hint}</p>
            </Card>
          ))}
        </section>

        {/* Top Traders */}
        <section className="flex flex-col gap-5" aria-label="Top traders">
          <div className="flex items-center gap-2">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-feedback-warning/15"
              aria-hidden="true"
            >
              <Award className="h-5 w-5 text-feedback-warning" strokeWidth={1.5} />
            </span>
            <h2 className="text-h3">Top traders</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {topTraders.map((trader) => (
              <Card key={trader.id} interactive className="flex flex-col p-4 sm:p-6">
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-interactive/15 text-body-sm font-semibold text-interactive"
                    aria-hidden="true"
                  >
                    {trader.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-body font-semibold text-text-primary">
                      {trader.name}
                    </p>
                    <div className="mt-1.5">
                      <Badge variant={riskBadgeVariant(trader.risk)}>
                        {trader.risk} risk
                      </Badge>
                    </div>
                  </div>
                </div>

                <dl className="mt-6 flex flex-col gap-3">
                  <div className="flex min-w-0 items-center justify-between gap-3">
                    <dt className="truncate text-body-sm text-text-tertiary">Win rate</dt>
                    <dd className="truncate font-mono tabular-nums text-body-sm font-medium text-text-primary">
                      {trader.winRate}%
                    </dd>
                  </div>
                  <div className="flex min-w-0 items-center justify-between gap-3">
                    <dt className="truncate text-body-sm text-text-tertiary">Total return</dt>
                    <dd className="flex min-w-0 items-center gap-1 truncate font-mono tabular-nums text-body-sm font-medium text-feedback-success">
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                      +{trader.totalReturn}%
                    </dd>
                  </div>
                  <div className="flex min-w-0 items-center justify-between gap-3">
                    <dt className="truncate text-body-sm text-text-tertiary">Monthly</dt>
                    <dd className="truncate font-mono tabular-nums text-body-sm font-medium text-feedback-success">
                      +{trader.monthlyReturn}%
                    </dd>
                  </div>
                  <div className="flex min-w-0 items-center justify-between gap-3">
                    <dt className="truncate text-body-sm text-text-tertiary">Followers</dt>
                    <dd className="truncate font-mono tabular-nums text-body-sm font-medium text-text-primary">
                      {trader.followers.toLocaleString()}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6">
                  {selectedTrader === trader.id ? (
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor={`allocation-${trader.id}`}>
                          Portfolio to allocate (%)
                        </Label>
                        <div className="relative">
                          <Users
                            className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-text-tertiary"
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                          <Input
                            id={`allocation-${trader.id}`}
                            type="number"
                            min="1"
                            max="100"
                            placeholder="e.g. 10"
                            value={allocation}
                            onChange={(e) => setAllocation(e.target.value)}
                            className="pl-10"
                            aria-label={`Percentage of your portfolio to allocate to ${trader.name}`}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setSelectedTrader(null);
                            setAllocation('');
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => handleSubscribe(trader.id)}
                          disabled={loading || !allocation}
                        >
                          {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            'Start following'
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setSelectedTrader(trader.id)}
                      className="w-full"
                      aria-label={`Follow ${trader.name}`}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Follow trader
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Active Subscriptions */}
        {subscriptions.length > 0 ? (
          <Card className="p-4 sm:p-6">
            <CardHeader className="p-0">
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-interactive" strokeWidth={1.5} />
                <span>Traders you follow</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-6">
              <div className="flex flex-col gap-3">
                {subscriptions.map((sub: any, index) => (
                  <div
                    key={index}
                    className="glass-inset flex items-center justify-between gap-3 rounded-xl p-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-interactive/15 text-caption font-semibold text-interactive"
                        aria-hidden="true"
                      >
                        T
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-body-sm font-medium text-text-primary">
                          Trader {sub.trader_id}
                        </p>
                        <p className="truncate font-mono tabular-nums text-caption text-text-tertiary">
                          {sub.allocation}% of your portfolio
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="shrink-0"
                      aria-label={`Stop following trader ${sub.trader_id}`}
                    >
                      Unfollow
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="p-6 text-center sm:p-10">
            <span
              className="glass-inset mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
              aria-hidden="true"
            >
              <Users className="h-6 w-6 text-text-tertiary" strokeWidth={1.5} />
            </span>
            <p className="text-body font-medium text-text-primary">
              You're not following any traders yet
            </p>
            <p className="mt-1 text-body-sm text-text-tertiary">
              Pick a trader above to start copying their trades.
            </p>
          </Card>
        )}
      </div>
    </Layout>
  );
}
