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
import { AssetLogo } from '@/components/AssetLogo';
import { LivePrice, PriceChange } from '@/components/LivePrice';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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

const EASE_GLASS = [0, 0, 0.2, 1] as const;

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
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-caption uppercase tracking-wider text-text-tertiary">Trade</span>
            <h1 className="text-h1 text-text-primary">Markets</h1>
            <p className="text-body-sm text-text-secondary">Live prices. Buy and sell in a tap.</p>
          </div>
          {lastUpdated && (
            <div className="flex items-center gap-1.5 text-caption text-text-tertiary tabular-nums">
              <RefreshCw className="h-3 w-3" aria-hidden="true" />
              Updated {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
          )}
        </div>

        {/* Market Overview — Ticker Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {assets.map((assetItem, index) => {
            const isSelected = assetItem.symbol === asset;
            return (
              <motion.div
                key={assetItem.symbol}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04, duration: 0.4, ease: EASE_GLASS }}
              >
                <Card
                  interactive
                  className={cn(
                    "cursor-pointer p-4",
                    isSelected &&
                      "border-interactive/60 bg-interactive/10 shadow-[0_0_20px_hsl(var(--interactive-default)/0.2)]"
                  )}
                  onClick={() => setAsset(assetItem.symbol)}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={`Select ${assetItem.name}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setAsset(assetItem.symbol);
                    }
                  }}
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <AssetLogo symbol={assetItem.symbol} size={28} />
                    <div className="min-w-0 flex-1">
                      <p className="text-body-sm font-medium text-text-primary truncate leading-tight">
                        {assetItem.symbol.replace('/USD', '')}
                      </p>
                      <p className="text-caption text-text-tertiary truncate leading-tight">
                        {assetItem.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-end justify-between gap-2">
                      {pricesLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-text-tertiary" aria-hidden="true" />
                      ) : (
                        <LivePrice
                          value={assetItem.price}
                          flash={false}
                          className={cn(
                            "text-body font-mono tabular-nums text-text-primary",
                            priceFlash[assetItem.symbol] === 'up' && "text-feedback-success",
                            priceFlash[assetItem.symbol] === 'down' && "text-feedback-error",
                          )}
                        />
                      )}
                      {!pricesLoading && (
                        <PriceChange changePercent={assetItem.changePercent} />
                      )}
                    </div>
                    {!pricesLoading && assetItem.volume > 0 && (
                      <p className="text-caption text-text-tertiary font-mono tabular-nums">
                        Vol{' '}
                        {assetItem.volume >= 1e9
                          ? `${(assetItem.volume / 1e9).toFixed(1)}B`
                          : assetItem.volume >= 1e6
                            ? `${(assetItem.volume / 1e6).toFixed(1)}M`
                            : assetItem.volume.toLocaleString()}
                      </p>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Trading Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Form */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: EASE_GLASS }}
          >
            <Card className="lg:col-span-1">
              <CardHeader>
                <div className="flex items-center gap-3">
                  {selectedAssetData && <AssetLogo symbol={selectedAssetData.symbol} size={24} />}
                  <CardTitle>
                    {orderType === 'buy' ? 'Buy' : 'Sell'} {asset.replace('/USD', '')}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <Tabs value={orderType} onValueChange={(v) => setOrderType(v as 'buy' | 'sell')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      value="buy"
                      className="font-medium data-[state=active]:bg-interactive/15 data-[state=active]:text-interactive"
                    >
                      Buy
                    </TabsTrigger>
                    <TabsTrigger
                      value="sell"
                      className="font-medium data-[state=active]:bg-feedback-error/15 data-[state=active]:text-feedback-error"
                    >
                      Sell
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="asset" className="text-caption uppercase tracking-wider text-text-tertiary">Asset</Label>
                  <Select value={asset} onValueChange={setAsset}>
                    <SelectTrigger id="asset">
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

                <div className="flex flex-col gap-2">
                  <Label htmlFor="size" className="text-caption uppercase tracking-wider text-text-tertiary">Quantity</Label>
                  <Input
                    id="size"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="font-mono tabular-nums"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-caption uppercase tracking-wider text-text-tertiary">Market price</Label>
                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-3">
                    {pricesLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-text-tertiary" aria-hidden="true" />
                        <span className="text-body-sm text-text-secondary">Loading price</span>
                      </div>
                    ) : (
                      <LivePrice
                        value={parseFloat(price || '0')}
                        className="text-h3 font-mono tabular-nums text-text-primary"
                      />
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-white/[0.08] pt-4 text-body-sm">
                  <span className="text-text-secondary">Total</span>
                  <span className="font-mono tabular-nums font-medium text-text-primary">
                    ${(parseFloat(size || '0') * parseFloat(price || '0')).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <Button
                  onClick={handleTrade}
                  disabled={loading || !size || parseFloat(price || '0') === 0 || pricesLoading}
                  variant={orderType === 'buy' ? 'primary' : 'destructive'}
                  size="lg"
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" aria-hidden="true" />
                      Placing order
                    </>
                  ) : (
                    <>
                      {orderType === 'buy' ? (
                        <TrendingUp aria-hidden="true" />
                      ) : (
                        <TrendingDown aria-hidden="true" />
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
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: EASE_GLASS }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-text-tertiary" aria-hidden="true" />
                  Recent trades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col divide-y divide-white/[0.06] max-h-[480px] overflow-y-auto pr-1">
                  {trades.length > 0 ? (
                    trades.map((trade: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-3 py-3 first:pt-0"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <AssetLogo symbol={trade.asset} size={28} />
                          <div className="min-w-0">
                            <p className="text-body-sm font-medium text-text-primary truncate">
                              {trade.side === 'buy' ? 'Bought' : 'Sold'} {trade.asset.replace('/USD', '')}
                            </p>
                            <p className="text-caption text-text-tertiary font-mono tabular-nums">
                              {trade.size} @ ${parseFloat(trade.price).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={cn(
                            "text-body-sm font-mono tabular-nums font-medium",
                            trade.side === 'buy' ? "text-feedback-error" : "text-feedback-success"
                          )}>
                            {trade.side === 'buy' ? '-' : '+'}${(trade.size * trade.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                          <p className="text-caption text-text-tertiary tabular-nums">
                            {new Date(trade.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full glass-tile flex items-center justify-center mx-auto mb-4">
                        <Activity className="h-8 w-8 text-text-tertiary" aria-hidden="true" />
                      </div>
                      <p className="text-body-sm font-medium text-text-secondary">No trades yet</p>
                      <p className="text-caption text-text-tertiary mt-1">
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
