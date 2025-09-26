import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
  LineChart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
  id: string;
  name: string;
  description: string;
  category: 'crypto' | 'quant';
  risk: 'low' | 'medium' | 'high';
  returns: string;
  minInvestment: number;
  subscribers: number;
  performance: any[];
  icon: any;
  subscribed?: boolean;
}

export default function Strategies() {
  const { toast } = useToast();
  const [subscribedStrategies, setSubscribedStrategies] = useState<Set<string>>(new Set());

  const cryptoStrategies: Strategy[] = [
    {
      id: 'btc-momentum',
      name: 'BTC Momentum',
      description: 'Rides Bitcoin trends using technical indicators and market sentiment analysis',
      category: 'crypto',
      risk: 'high',
      returns: '+45.2%',
      minInvestment: 1000,
      subscribers: 1234,
      performance: generatePerformanceData(),
      icon: Bitcoin
    },
    {
      id: 'eth-longterm',
      name: 'ETH Long-term Hold',
      description: 'Strategic accumulation of Ethereum during market dips for long-term growth',
      category: 'crypto',
      risk: 'medium',
      returns: '+32.8%',
      minInvestment: 500,
      subscribers: 2156,
      performance: generatePerformanceData(),
      icon: Shield
    },
    {
      id: 'stablecoin-yield',
      name: 'Stablecoin Yield',
      description: 'Earn consistent returns through stablecoin lending and liquidity provision',
      category: 'crypto',
      risk: 'low',
      returns: '+8.5%',
      minInvestment: 100,
      subscribers: 3421,
      performance: generatePerformanceData(),
      icon: DollarSign
    },
    {
      id: 'altcoin-gems',
      name: 'Altcoin Gems',
      description: 'High-risk, high-reward strategy focusing on emerging cryptocurrencies',
      category: 'crypto',
      risk: 'high',
      returns: '+125.3%',
      minInvestment: 2000,
      subscribers: 876,
      performance: generatePerformanceData(),
      icon: Zap
    }
  ];

  const quantStrategies: Strategy[] = [
    {
      id: 'mean-reversion',
      name: 'Mean Reversion',
      description: 'Exploits price deviations from historical averages across multiple assets',
      category: 'quant',
      risk: 'medium',
      returns: '+28.4%',
      minInvestment: 1500,
      subscribers: 987,
      performance: generatePerformanceData(),
      icon: Activity
    },
    {
      id: 'momentum-trading',
      name: 'Momentum Trading',
      description: 'Follows strong price trends using algorithmic signals and volume analysis',
      category: 'quant',
      risk: 'medium',
      returns: '+35.7%',
      minInvestment: 1000,
      subscribers: 1543,
      performance: generatePerformanceData(),
      icon: TrendingUp
    },
    {
      id: 'arbitrage-sim',
      name: 'Arbitrage Simulation',
      description: 'Simulates cross-exchange arbitrage opportunities in real-time',
      category: 'quant',
      risk: 'low',
      returns: '+12.3%',
      minInvestment: 5000,
      subscribers: 654,
      performance: generatePerformanceData(),
      icon: BarChart3
    },
    {
      id: 'ai-predictor',
      name: 'AI Predictor',
      description: 'Machine learning model predicting short-term price movements',
      category: 'quant',
      risk: 'high',
      returns: '+67.9%',
      minInvestment: 3000,
      subscribers: 432,
      performance: generatePerformanceData(),
      icon: Cpu
    }
  ];

  const handleSubscribe = (strategyId: string, strategyName: string) => {
    setSubscribedStrategies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(strategyId)) {
        newSet.delete(strategyId);
        toast({
          title: "Unsubscribed",
          description: `You have unsubscribed from ${strategyName}`,
        });
      } else {
        newSet.add(strategyId);
        toast({
          title: "Subscribed Successfully",
          description: `You are now following the ${strategyName} strategy`,
        });
      }
      return newSet;
    });
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
    const Icon = strategy.icon;
    const isSubscribed = subscribedStrategies.has(strategy.id);

    return (
      <Card className="bg-gradient-card border-border/50 backdrop-blur-sm hover-lift">
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <Badge variant={getRiskBadgeVariant(strategy.risk)}>
              {strategy.risk.toUpperCase()} RISK
            </Badge>
          </div>
          <CardTitle className="text-lg">{strategy.name}</CardTitle>
          <CardDescription className="text-sm">
            {strategy.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Performance Chart */}
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={strategy.performance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis dataKey="day" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={false}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-background/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Returns</p>
              <p className={cn(
                "text-sm font-bold",
                strategy.returns.startsWith('+') ? "text-success" : "text-loss"
              )}>
                {strategy.returns}
              </p>
            </div>
            <div className="p-2 bg-background/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Min. Invest</p>
              <p className="text-sm font-bold">${strategy.minInvestment}</p>
            </div>
            <div className="p-2 bg-background/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Subscribers</p>
              <p className="text-sm font-bold">{strategy.subscribers}</p>
            </div>
          </div>

          {/* Subscribe Button */}
          <Button 
            className="w-full"
            variant={isSubscribed ? "secondary" : "premium"}
            onClick={() => handleSubscribe(strategy.id, strategy.name)}
          >
            {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Investment Strategies</h1>
          <p className="text-muted-foreground mt-1">
            Choose from our curated strategies or create your own portfolio
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-card backdrop-blur-sm border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Strategies</p>
                <p className="text-2xl font-bold">{subscribedStrategies.size}</p>
              </div>
              <Target className="h-8 w-8 text-primary opacity-20" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-card backdrop-blur-sm border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Returns</p>
                <p className="text-2xl font-bold text-success">+24.5%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success opacity-20" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-card backdrop-blur-sm border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Invested</p>
                <p className="text-2xl font-bold">$12,450</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary opacity-20" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-card backdrop-blur-sm border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Risk Score</p>
                <p className="text-2xl font-bold">Medium</p>
              </div>
              <Shield className="h-8 w-8 text-warning opacity-20" />
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