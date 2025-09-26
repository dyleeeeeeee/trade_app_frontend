import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { tradingAPI } from '@/lib/api';
import { toast } from 'sonner';
import { 
  TrendingUp, 
  TrendingDown,
  Activity,
  Loader2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Trading() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [asset, setAsset] = useState('BTC/USD');
  const [size, setSize] = useState('');
  const [price, setPrice] = useState('');
  const [assets, setAssets] = useState([
    { symbol: 'BTC/USD', name: 'Bitcoin', price: 0, change: 0, id: 'bitcoin' },
    { symbol: 'ETH/USD', name: 'Ethereum', price: 0, change: 0, id: 'ethereum' },
    { symbol: 'AAPL', name: 'Apple Inc.', price: 0, change: 0, id: 'apple' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 0, change: 0, id: 'google' }
  ]);
  const [pricesLoading, setPricesLoading] = useState(true);

  useEffect(() => {
    fetchTrades();
    fetchPrices();
  }, []);

  useEffect(() => {
    // Update price when asset changes
    const selectedAsset = assets.find(a => a.symbol === asset);
    if (selectedAsset) {
      setPrice(selectedAsset.price.toString());
    }
  }, [asset, assets]);

  const fetchTrades = async () => {
    try {
      const response = await tradingAPI.getTrades();
      if (response.ok) {
        const data = await response.json();
        setTrades(data.trades || []);
      }
    } catch (error) {
      console.error('Failed to fetch trades:', error);
    }
  };

  const fetchPrices = async () => {
    setPricesLoading(true);
    try {
      const response = await tradingAPI.getPrices();
      if (response.ok) {
        const data = await response.json();
        setAssets(data.assets.map(a => ({ ...a, price: parseFloat(a.price) })));
      }
    } catch (error) {
      console.error('Failed to fetch prices:', error);
    } finally {
      setPricesLoading(false);
    }
  };

  const handleTrade = async () => {
    setLoading(true);
    try {
      const response = await tradingAPI.placeTrade(
        asset,
        orderType,
        parseFloat(size)
      );
      
      if (response.ok) {
        toast.success(`${orderType === 'buy' ? 'Buy' : 'Sell'} order placed successfully!`);
        setSize('');
        fetchTrades();
      } else {
        toast.error('Failed to place order');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Trading</h1>
          <p className="text-muted-foreground mt-1">Buy and sell assets in real-time</p>
        </div>

        {/* Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {assets.map((assetItem) => (
            <Card 
              key={assetItem.symbol} 
              className={cn(
                "bg-gradient-card border-border/50 backdrop-blur-sm cursor-pointer hover:shadow-glow transition-all",
                assetItem.symbol === asset && "ring-2 ring-primary shadow-lg scale-105"
              )}
              onClick={() => setAsset(assetItem.symbol)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{assetItem.symbol}</p>
                    <p className="text-xs text-muted-foreground">{assetItem.name}</p>
                  </div>
                  <div className={cn(
                    "flex items-center text-xs",
                    assetItem.change > 0 ? "text-success" : "text-loss"
                  )}>
                    {assetItem.change > 0 ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {Math.abs(assetItem.change)}%
                  </div>
                </div>
                <p className="text-xl font-bold text-foreground">
                  {pricesLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Loading...</span>
                    </div>
                  ) : (
                    `$${assetItem.price.toLocaleString()}`
                  )}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trading Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Form */}
          <Card className="lg:col-span-1 bg-gradient-card border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Place Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={orderType} onValueChange={(v) => setOrderType(v as 'buy' | 'sell')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="buy" className="data-[state=active]:bg-success/20 data-[state=active]:text-success">
                    Buy
                  </TabsTrigger>
                  <TabsTrigger value="sell" className="data-[state=active]:bg-loss/20 data-[state=active]:text-loss">
                    Sell
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-2">
                <Label htmlFor="asset">Asset</Label>
                <Select value={asset} onValueChange={setAsset}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {assets.map((a) => (
                      <SelectItem key={a.symbol} value={a.symbol}>
                        {a.symbol} - {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">Quantity</Label>
                <Input
                  id="size"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label>Current Price</Label>
                <div className="p-3 bg-background/50 rounded-lg">
                  {pricesLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Fetching price...</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-lg font-semibold text-foreground">
                        ${parseFloat(price || '0').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-muted-foreground">Market price for {asset}</p>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Value</span>
                  <span className="font-medium text-foreground">
                    ${(parseFloat(size || '0') * parseFloat(price || '0')).toFixed(2)}
                  </span>
                </div>
              </div>

              <Button 
                onClick={handleTrade}
                disabled={loading || !size || parseFloat(price || '0') === 0 || pricesLoading}
                className={cn(
                  "w-full",
                  orderType === 'buy' 
                    ? "bg-success hover:bg-success/80" 
                    : "bg-loss hover:bg-loss/80"
                )}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {orderType === 'buy' ? (
                      <TrendingUp className="mr-2 h-4 w-4" />
                    ) : (
                      <TrendingDown className="mr-2 h-4 w-4" />
                    )}
                    {orderType === 'buy' ? 'Buy' : 'Sell'} {asset}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Recent Trades */}
          <Card className="lg:col-span-2 bg-gradient-card border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Trade History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {trades.length > 0 ? (
                  trades.map((trade: any, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          trade.side === 'buy' ? "bg-success/10" : "bg-loss/10"
                        )}>
                          {trade.side === 'buy' ? (
                            <TrendingUp className="h-4 w-4 text-success" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-loss" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {trade.side === 'buy' ? 'Bought' : 'Sold'} {trade.asset}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {trade.size} @ ${trade.price}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">
                          ${(trade.size * trade.price).toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(trade.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No trades yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Place your first order to get started
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}