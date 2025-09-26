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
      toast.error('Please enter an allocation percentage');
      return;
    }

    setLoading(true);
    try {
      const response = await tradingAPI.subscribeToTrader(traderId, parseFloat(allocation));
      if (response.ok) {
        toast.success('Successfully subscribed to trader!');
        setSelectedTrader(null);
        setAllocation('');
        fetchData();
      } else {
        toast.error('Failed to subscribe');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  // Mock trader data
  const topTraders = [
    {
      id: 'trader1',
      name: 'Alex Chen',
      avatar: '👨‍💼',
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
      avatar: '👩‍💼',
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
      avatar: '🧑‍💼',
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
          <h1 className="text-3xl font-bold text-foreground">Copy Trading</h1>
          <p className="text-muted-foreground mt-1">Follow successful traders and copy their strategies</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-card border-border/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Subscriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{subscriptions.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Following traders</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Allocated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {subscriptions.reduce((sum: number, sub: any) => sum + (sub.allocation || 0), 0)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">Of portfolio</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">+15.3%</div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Top Traders */}
        <Card className="bg-gradient-card border-border/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-warning" />
              <span>Top Traders</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topTraders.map((trader) => (
                <Card 
                  key={trader.id}
                  className="bg-background/50 border-border/50 hover:shadow-glow transition-all"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{trader.avatar}</div>
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
                              {trader.risk} Risk
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Win Rate</span>
                        <span className="font-medium text-foreground">{trader.winRate}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Return</span>
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
                          <Label htmlFor={`allocation-${trader.id}`}>Allocation %</Label>
                          <Input
                            id={`allocation-${trader.id}`}
                            type="number"
                            min="1"
                            max="100"
                            placeholder="Enter %"
                            value={allocation}
                            onChange={(e) => setAllocation(e.target.value)}
                            className="bg-background/50"
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
                              'Confirm'
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setSelectedTrader(trader.id)}
                        className="w-full bg-gradient-primary hover:shadow-glow"
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Trader
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Subscriptions */}
        {subscriptions.length > 0 && (
          <Card className="bg-gradient-card border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5" />
                <span>Your Subscriptions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {subscriptions.map((sub: any, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">👤</div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Trader {sub.trader_id}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Allocation: {sub.allocation}%
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Unfollow
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}