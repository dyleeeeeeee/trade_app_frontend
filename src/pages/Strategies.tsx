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
          title: "Error",
          description: "Failed to load strategies",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error loading strategies",
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
        title: "Error",
        description: "Please enter a valid investment amount",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(investmentAmount);
    if (amount < strategy.min_investment) {
      toast({
        title: "Error",
        description: `Minimum investment is $${strategy.min_investment}`,
        variant: "destructive"
      });
      return;
    }

    if (strategy.max_investment && amount > strategy.max_investment) {
      toast({
        title: "Error",
        description: `Maximum investment is $${strategy.max_investment}`,
        variant: "destructive"
      });
      return;
    }

    setSubscribing(strategy.id);
    try {
      const response = await strategyAPI.subscribeToStrategy(strategy.id, amount);
      if (response.ok) {
        toast({
          title: "Success",
          description: `Successfully subscribed to ${strategy.name}!`,
        });
        setDialogOpen(false);
        setInvestmentAmount('');
        setSelectedStrategy(null);
        fetchMyStrategies();
        fetchStrategies(); // Refresh strategy data to update subscriber counts
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to subscribe",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error during subscription",
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
          title: "Success",
          description: `Successfully unsubscribed from ${strategyName}`,
        });
        fetchMyStrategies();
        fetchStrategies();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to unsubscribe",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error during unsubscription",
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
        return 'secondary';
      case 'medium':
        return 'default';
      case 'high':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const StrategyCard = ({ strategy }: { strategy: Strategy }) => {
    const Icon = getIcon(strategy.category, strategy.risk_level);
    const isSubscribed = myStrategies.some(s => s.strategy_id === strategy.id);

    return (
      <Card className="bg-gradient-card border-border/50 backdrop-blur-sm hover-lift">
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <Badge variant={getRiskBadgeVariant(strategy.risk_level)}>
              {strategy.risk_level.toUpperCase()} RISK
            </Badge>
          </div>
          <CardTitle className="text-lg">{strategy.name}</CardTitle>
          <CardDescription className="text-sm">
            {strategy.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Performance Chart Placeholder */}
          <div className="h-32 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <LineChart className="h-8 w-8 mx-auto mb-2" />
              <p className="text-xs">Performance data coming soon</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-background/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Daily ROI</p>
              <p className={cn(
                "text-sm font-bold",
                strategy.expected_roi > 1 ? "text-success" : "text-foreground"
              )}>
                {strategy.expected_roi.toFixed(2)}%
              </p>
            </div>
            <div className="p-2 bg-background/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Min. Invest</p>
              <p className="text-sm font-bold">${strategy.min_investment.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-background/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Subscribers</p>
              <p className="text-sm font-bold">{strategy.subscriber_count}</p>
            </div>
          </div>

          {/* Subscribe Button */}
          {isSubscribed ? (
            <Button 
              variant="secondary"
              className="w-full"
              onClick={() => handleUnsubscribe(strategy.id, strategy.name)}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Subscribed
            </Button>
          ) : (
            <Dialog open={dialogOpen && selectedStrategy?.id === strategy.id} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="w-full bg-gradient-primary hover:shadow-glow"
                  onClick={() => {
                    setSelectedStrategy(strategy);
                    setDialogOpen(true);
                  }}
                >
                  Subscribe
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Subscribe to {strategy.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="p-4 bg-background/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Strategy Details</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Daily ROI</p>
                        <p className="font-medium">{strategy.expected_roi.toFixed(2)}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Risk Level</p>
                        <p className="font-medium capitalize">{strategy.risk_level}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Min Investment</p>
                        <p className="font-medium">${strategy.min_investment.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Max Investment</p>
                        <p className="font-medium">
                          {strategy.max_investment ? `$${strategy.max_investment.toLocaleString()}` : 'No limit'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="investment">Investment Amount ($)</Label>
                    <Input
                      id="investment"
                      type="number"
                      placeholder={`Min: $${strategy.min_investment}`}
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                      min={strategy.min_investment}
                      max={strategy.max_investment}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1 bg-gradient-primary hover:shadow-glow"
                      onClick={() => handleSubscribe(strategy)}
                      disabled={subscribing === strategy.id}
                    >
                      {subscribing === strategy.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Subscribing...
                        </>
                      ) : (
                        'Confirm Subscription'
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  const cryptoStrategies = strategies.filter(s => s.category === 'crypto');
  const quantStrategies = strategies.filter(s => s.category === 'quant');

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Investment Strategies</h1>
          <p className="text-muted-foreground mt-1">
            Choose from our curated strategies powered by AI and quantitative analysis
          </p>
        </div>

        {/* My Strategies Summary */}
        {myStrategies.length > 0 && (
          <Card className="bg-gradient-card border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>My Active Strategies</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myStrategies.map((strategy) => (
                  <div key={strategy.subscription_id} className="p-4 bg-background/50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-foreground">{strategy.strategy_name}</h4>
                      <Badge variant={getRiskBadgeVariant(strategy.risk_level)}>
                        {strategy.risk_level}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-muted-foreground">Invested: <span className="text-foreground font-medium">${strategy.invested_amount.toLocaleString()}</span></p>
                      <p className="text-muted-foreground">Earnings: <span className="text-success font-medium">+${strategy.total_earnings.toFixed(2)}</span></p>
                      <p className="text-muted-foreground">Days Active: <span className="text-foreground font-medium">{strategy.days_active}</span></p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full mt-3"
                      onClick={() => handleUnsubscribe(strategy.strategy_id, strategy.strategy_name)}
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-card backdrop-blur-sm border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Strategies</p>
                <p className="text-2xl font-bold">{myStrategies.length}</p>
              </div>
              <Target className="h-8 w-8 text-primary opacity-20" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-card backdrop-blur-sm border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Invested</p>
                <p className="text-2xl font-bold">
                  ${myStrategies.reduce((sum, s) => sum + s.invested_amount, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-primary opacity-20" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-card backdrop-blur-sm border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold text-success">
                  +${myStrategies.reduce((sum, s) => sum + s.total_earnings, 0).toFixed(2)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-success opacity-20" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-card backdrop-blur-sm border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Daily ROI</p>
                <p className="text-2xl font-bold">
                  {myStrategies.length > 0 
                    ? (myStrategies.reduce((sum, s) => sum + s.expected_roi, 0) / myStrategies.length).toFixed(2)
                    : '0.00'
                  }%
                </p>
              </div>
              <Activity className="h-8 w-8 text-warning opacity-20" />
            </div>
          </Card>
        </div>

        {/* Strategy Tabs */}
        <Tabs defaultValue="crypto" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="crypto" className="flex items-center gap-2">
              <Bitcoin className="h-4 w-4" />
              Crypto Strategies
            </TabsTrigger>
            <TabsTrigger value="quant" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              Quant Strategies
            </TabsTrigger>
          </TabsList>

          <TabsContent value="crypto" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {cryptoStrategies.map((strategy) => (
                <StrategyCard key={strategy.id} strategy={strategy} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="quant" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {quantStrategies.map((strategy) => (
                <StrategyCard key={strategy.id} strategy={strategy} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}