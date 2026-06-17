import { useState, useEffect, useRef, useCallback } from 'react';
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
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface AssetData {
  symbol: string;
  name: string;
  id: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  volume: number;
  marketCap: number;
}

export default function Trading() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [asset, setAsset] = useState('BTC/USD');
  const [size, setSize] = useState('');
  const [price, setPrice] = useState('');
  const [assets, setAssets] = useState<AssetData[]>([]);
  const [pricesLoading, setPricesLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [priceFlash, setPriceFlash] = useState<Record<string, 'up' | 'down' | null>>({});
  const prevPrices = useRef<Record<string, number>>({});

  useEffect(() => {
    fetchTrades();
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
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

  const fetchPrices = useCallback(async () => {
    if (assets.length === 0) setPricesLoading(true);
    try {
      const response = await tradingAPI.getPrices();
      if (response.ok) {
        const data = await response.json();
        const newAssets: AssetData[] = data.assets.map((a: any) => ({
          ...a,
          price: parseFloat(a.price),
          change: a.change || 0,
          changePercent: a.changePercent || 0,
          previousClose: a.previousClose || 0,
          volume: a.volume || 0,
          marketCap: a.marketCap || 0,
        }));

        // Detect price direction for flash animation
        const flashes: Record<string, 'up' | 'down' | null> = {};
        newAssets.forEach(a => {
          const prev = prevPrices.current[a.symbol];
          if (prev && prev !== a.price) {
            flashes[a.symbol] = a.price > prev ? 'up' : 'down';
          }
          prevPrices.current[a.symbol] = a.price;
        });
        if (Object.keys(flashes).length > 0) {
          setPriceFlash(flashes);
          setTimeout(() => setPriceFlash({}), 1200);
        }

        setAssets(newAssets);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch prices:', error);
    } finally {
      setPricesLoading(false);
    }
  }, [assets.length]);

  const handleTrade = async () => {
    setLoading(true);
    try {
      const response = await tradingAPI.placeTrade(
        asset,
        orderType,
        parseFloat(size)
      );

      if (response.ok) {
        toast.success(`${orderType === 'buy' ? 'Buy' : 'Sell'} order placed`);
        setSize('');
        fetchTrades();
      } else {
        toast.error('We couldn’t place your order');
      }
    } catch (error) {
      toast.error('Check your connection and try again');
    } finally {
      setLoading(false);
    }
  };

  const selectedAssetData = assets.find(a => a.symbol === asset);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Markets</h1>
            <p className="text-muted-foreground mt-1">Live prices. Buy and sell in a tap.</p>
          </div>
          {lastUpdated && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <RefreshCw className="h-3 w-3" />
              Updated {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
          )}
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
                  role="button"
                  aria-label={`Select ${assetItem.name}`}
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
                    <div className="space-y-1.5">
                      <div className="flex items-end justify-between">
                        <p
                          className={cn(
                            "text-lg font-bold text-foreground font-mono transition-colors duration-300",
                            priceFlash[assetItem.symbol] === 'up' && "text-emerald-300",
                            priceFlash[assetItem.symbol] === 'down' && "text-red-300",
                          )}
                        >
                          {pricesLoading ? (
                            <span className="inline-flex items-center gap-1.5">
                              <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                            </span>
                          ) : (
                            `$${assetItem.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                          )}
                        </p>
                        {!pricesLoading && (
                          <span className={cn(
                            "inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-full",
                            assetItem.changePercent >= 0
                              ? "bg-emerald-500/15 text-emerald-400"
                              : "bg-red-500/15 text-red-400"
                          )}>
                            {assetItem.changePercent >= 0 ? (
                              <ArrowUpRight className="h-3 w-3" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3" />
                            )}
                            {Math.abs(assetItem.changePercent).toFixed(2)}%
                          </span>
                        )}
                      </div>
                      {!pricesLoading && assetItem.volume > 0 && (
                        <p className="text-[10px] text-slate-500 font-mono">
                          Vol: {assetItem.volume >= 1e9
                            ? `${(assetItem.volume / 1e9).toFixed(1)}B`
                            : assetItem.volume >= 1e6
                              ? `${(assetItem.volume / 1e6).toFixed(1)}M`
                              : assetItem.volume.toLocaleString()}
                        </p>
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
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Market price</Label>
                  <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
                    {pricesLoading ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Loading price</span>
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
                      Placing order
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
                  Recent trades
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
                        Place an order and it’ll appear here.
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
