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
  TrendingUp,
  Star,
  Copy,
  Loader2,
  UserCheck,
  DollarSign,
  Award
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
      gradient: 'from-blue-500 to-purple-600',
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
      gradient: 'from-emerald-500 to-teal-600',
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
      gradient: 'from-orange-500 to-red-600',
      winRate: 71,
      totalReturn: 312.7,
      followers: 2103,
      risk: 'High',
      monthlyReturn: 18.2,
      trades: 523
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Copy trading</h1>
          <p className="text-muted-foreground mt-1">Follow experienced traders and mirror their trades automatically.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Traders followed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{subscriptions.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Active right now</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Portfolio allocated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {subscriptions.reduce((sum: number, sub: any) => sum + (sub.allocation || 0), 0)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">Across followed traders</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average return
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">+15.3%</div>
              <p className="text-xs text-muted-foreground mt-1">Past 30 days. Past results don't guarantee future returns.</p>
            </CardContent>
          </Card>
        </div>

        {/* Top Traders */}
        <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-warning" />
              <span>Top traders</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topTraders.map((trader) => (
                <Card 
                  key={trader.id}
                  className="bg-slate-900/40 border-slate-700/30 hover:bg-slate-900/70 transition-all"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br", trader.gradient)}>
                          {trader.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{trader.name}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge 
                              variant="secondary" 
                              className={cn(
                                "text-xs",
                                trader.risk === 'Low' && "bg-success/20 text-success",
                                trader.risk === 'Medium' && "bg-warning/20 text-warning",
                                trader.risk === 'High' && "bg-loss/20 text-loss"
                              )}
                            >
                              {trader.risk} risk
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Win rate</span>
                        <span className="font-medium text-foreground">{trader.winRate}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total return</span>
                        <span className="font-medium text-success">+{trader.totalReturn}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Monthly</span>
                        <span className="font-medium text-foreground">+{trader.monthlyReturn}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Followers</span>
                        <span className="font-medium text-foreground">{trader.followers}</span>
                      </div>
                    </div>

                    {selectedTrader === trader.id ? (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor={`allocation-${trader.id}`}>Portfolio to allocate (%)</Label>
                          <Input
                            id={`allocation-${trader.id}`}
                            type="number"
                            min="1"
                            max="100"
                            placeholder="e.g. 10"
                            value={allocation}
                            onChange={(e) => setAllocation(e.target.value)}
                            className="bg-background/50"
                            aria-label={`Percentage of your portfolio to allocate to ${trader.name}`}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
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
                            className="bg-gradient-primary hover:shadow-glow"
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
                        className="w-full bg-gradient-primary hover:shadow-glow"
                        aria-label={`Follow ${trader.name}`}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Follow trader
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Subscriptions */}
        {subscriptions.length > 0 ? (
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5" />
                <span>Traders you follow</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {subscriptions.map((sub: any, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-900/40 rounded-xl border border-slate-700/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center text-xs font-bold text-white">T</div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Trader {sub.trader_id}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {sub.allocation}% of your portfolio
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" aria-label={`Stop following trader ${sub.trader_id}`}>
                      Unfollow
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <Users className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-foreground">You're not following any traders yet</p>
              <p className="text-xs text-muted-foreground mt-1">Pick a trader above to start copying their trades.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}