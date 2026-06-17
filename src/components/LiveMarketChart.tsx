import * as React from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts';

import type { AssetPrice } from '@/hooks/use-prices';
import { AssetLogo } from '@/components/AssetLogo';
import { LivePrice, PriceChange } from '@/components/LivePrice';

const PROFIT = 'hsl(150 48% 50%)';
const LOSS = 'hsl(4 72% 63%)';

/**
 * LiveMarketChart — a minimal line embedded in glass with a soft glow trace.
 * The series is built from real data: seeded with the asset's previous close,
 * then each live poll appends the current price. No synthetic points.
 */
export function LiveMarketChart({ asset }: { asset?: AssetPrice }) {
  const [series, setSeries] = React.useState<{ t: number; price: number }[]>([]);
  const seeded = React.useRef(false);

  React.useEffect(() => {
    if (!asset) return;
    const price = Number(asset.price);
    if (!Number.isFinite(price)) return;
    setSeries((prev) => {
      let next = prev;
      if (!seeded.current) {
        seeded.current = true;
        const base = asset.previousClose || price;
        next = [{ t: 0, price: base }];
      }
      const last = next[next.length - 1];
      if (last && last.price === price) return next;
      return [...next, { t: (last?.t ?? 0) + 1, price }].slice(-48);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset?.price]);

  if (!asset) {
    return <div className="h-[180px] w-full animate-pulse rounded-xl bg-white/[0.04]" />;
  }

  const positive = asset.changePercent >= 0;
  const color = positive ? PROFIT : LOSS;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AssetLogo symbol={asset.symbol} size={36} />
          <div>
            <p className="text-body-sm font-semibold text-text-primary">{asset.name}</p>
            <p className="text-caption uppercase text-text-tertiary">{asset.symbol}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <LivePrice value={Number(asset.price)} className="font-mono text-h3 font-semibold" />
          <PriceChange changePercent={asset.changePercent} />
        </div>
      </div>

      <div className="h-[160px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series} margin={{ top: 8, right: 4, bottom: 0, left: 4 }}>
            <defs>
              <linearGradient id={`fill-${asset.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.28} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
              <filter id={`glow-${asset.id}`} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <YAxis hide domain={['dataMin', 'dataMax']} />
            <Tooltip
              cursor={{ stroke: 'hsl(0 0% 100% / 0.12)', strokeWidth: 1 }}
              contentStyle={{
                background: 'hsl(220 32% 14% / 0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid hsl(0 0% 100% / 0.1)',
                borderRadius: 12,
                boxShadow: '0 8px 32px hsl(224 40% 3% / 0.5)',
                color: 'hsl(210 40% 98%)',
                fontSize: 12,
              }}
              labelFormatter={() => ''}
              formatter={(v: number) => [`$${v.toLocaleString('en-US', { maximumFractionDigits: 2 })}`, 'Price']}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={color}
              strokeWidth={2}
              strokeLinecap="round"
              fill={`url(#fill-${asset.id})`}
              filter={`url(#glow-${asset.id})`}
              isAnimationActive={false}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
