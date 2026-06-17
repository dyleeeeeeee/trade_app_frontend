import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { tradingAPI } from '@/lib/api';
import { toast } from 'sonner';
import { AssetLogo, getAssetColor } from '@/components/AssetLogo';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Loader2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 0, change: 0, id: 'google' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 0, change: 0, id: 'nvidia' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 0, change: 0, id: 'tesla' },
    { symbol: 'META', name: 'Meta Platforms', price: 0, change: 0, id: 'meta' },
    { symbol: 'AMZN', name: 'Amazon.com', price: 0, change: 0, id: 'amazon' },
    { symbol: 'SPACEX', name: 'SpaceX', price: 0, change: 0, id: 'spacex' },
  ]);
  const [pricesLoading, setPricesLoading] = useState(true);

  useEffect(() => {
    fetchTrades();
    fetchPrices();
  }, []);

  useEffect(() => {
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
        setAssets(data.assets.map((a: any) => ({ ...a, price: parseFloat(a.price) })));
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

  const selectedAssetData = assets.find(a => a.symbol === asset);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Markets</h1>
          <p className="text-muted-foreground mt-1">Real-time prices and trading</p>
        </div>

        {/* Market Overview — Ticker Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {assets.map((assetItem, index) => {
            const brandColor = getAssetColor(assetItem.symbol);
            const isSelected = assetItem.symbol === asset;
            return (
              <motion.div
                key={assetItem.symbol}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.3 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Card
                  className={cn(
                    "cursor-pointer transition-all duration-200 border backdrop-blur-sm",
                    "bg-slate-800/40 hover:bg-slate-800/70",
                    isSelected
                      ? "border-[color:var(--sel-color)] shadow-[0_0_16px_var(--sel-color-dim)]"
                      : "border-slate-700/50 hover:border-slate-600/80"
                  )}
                  style={{
                    '--sel-color': brandColor,
                    '--sel-color-dim': `${brandColor}33`,
                  } as React.CSSProperties}
                  onClick={() => setAsset(assetItem.symbol)}
                >
                  <CardContent className="p-3.5">
                    <div className="flex items-center gap-2.5 mb-3">
                      <AssetLogo symbol={assetItem.symbol} size={28} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-foreground truncate leading-tight">
                          {assetItem.symbol.replace('/USD', '')}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate leading-tight">
                          {assetItem.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-end justify-between">
                      <p className="text-lg font-bold text-foreground" style={{ fontFamily: 'var(--font-mono, monospace)' }}>
                        {pricesLoading ? (
                          <span className="inline-flex items-center gap-1.5">
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                          </span>
                        ) : (
                          `$${assetItem.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
                        )}
                      </p>
                      {!pricesLoading && (
                        <span className={cn(
                          "inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-full",
                          assetItem.change > 0
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-red-500/15 text-red-400"
                        )}>
                          {assetItem.change > 0 ? (
                            <ArrowUpRight className="h-3 w-3" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3" />
                          )}
                          {Math.abs(assetItem.change).toFixed(2)}%
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Trading Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Card className="lg:col-span-1 bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  {selectedAssetData && <AssetLogo symbol={selectedAssetData.symbol} size={24} />}
                  <CardTitle className="text-lg">
                    {orderType === 'buy' ? 'Buy' : 'Sell'} {asset.replace('/USD', '')}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs value={orderType} onValueChange={(v) => setOrderType(v as 'buy' | 'sell')}>
                  <TabsList className="grid w-full grid-cols-2 bg-slate-900/50">
                    <TabsTrigger value="buy" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 font-semibold">
                      Buy
                    </TabsTrigger>
                    <TabsTrigger value="sell" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400 font-semibold">
                      Sell
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="space-y-1.5">
                  <Label htmlFor="asset" className="text-xs uppercase tracking-wider text-muted-foreground">Asset</Label>
                  <Select value={asset} onValueChange={setAsset}>
                    <SelectTrigger className="bg-slate-900/50 border-slate-700/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {assets.map((a) => (
                        <SelectItem key={a.symbol} value={a.symbol}>
                          <span className="flex items-center gap-2">
                            <AssetLogo symbol={a.symbol} size={16} />
                            {a.symbol} — {a.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="size" className="text-xs uppercase tracking-wider text-muted-foreground">Quantity</Label>
                  <Input
                    id="size"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="bg-slate-900/50 border-slate-700/50 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Market Price</Label>
                  <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
                    {pricesLoading ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Fetching...</span>
                      </div>
                    ) : (
                      <p className="text-xl font-bold text-foreground font-mono">
                        ${parseFloat(price || '0').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-2 pb-1">
                  <div className="flex justify-between text-sm py-2 border-t border-slate-700/30">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-bold text-foreground font-mono">
                      ${(parseFloat(size || '0') * parseFloat(price || '0')).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleTrade}
                  disabled={loading || !size || parseFloat(price || '0') === 0 || pricesLoading}
                  className={cn(
                    "w-full h-12 text-base font-semibold rounded-xl transition-all",
                    orderType === 'buy'
                      ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_4px_16px_rgba(16,185,129,0.3)]"
                      : "bg-red-500 hover:bg-red-400 text-white shadow-[0_4px_16px_rgba(239,68,68,0.3)]"
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
                      {orderType === 'buy' ? 'Buy' : 'Sell'} {asset.replace('/USD', '')}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Trade History */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm h-full">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="h-5 w-5 text-muted-foreground" />
                  Trade History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                  {trades.length > 0 ? (
                    trades.map((trade: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.03 }}
                        className="flex items-center justify-between p-3 bg-slate-900/40 rounded-xl border border-slate-700/30 hover:bg-slate-900/70 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <AssetLogo symbol={trade.asset} size={28} />
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {trade.side === 'buy' ? 'Bought' : 'Sold'} {trade.asset.replace('/USD', '')}
                            </p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {trade.size} @ ${parseFloat(trade.price).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={cn(
                            "text-sm font-bold font-mono",
                            trade.side === 'buy' ? "text-emerald-400" : "text-red-400"
                          )}>
                            {trade.side === 'buy' ? '-' : '+'}${(trade.size * trade.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {new Date(trade.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                        <Activity className="h-8 w-8 text-slate-600" />
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">No trades yet</p>
                      <p className="text-xs text-slate-600 mt-1">
                        Place your first order to get started
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
