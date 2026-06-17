import { useQuery } from '@tanstack/react-query';
import { tradingAPI } from '@/lib/api';

/** Shape returned by GET /api/prices (yfinance-backed, 30s server cache). */
export interface AssetPrice {
  symbol: string;
  name: string;
  id: string;
  price: string;
  change: number;
  changePercent: number;
  previousClose: number;
  volume: number;
  marketCap: number;
}

async function fetchPrices(): Promise<AssetPrice[]> {
  const res = await tradingAPI.getPrices();
  if (!res.ok) throw new Error('Failed to load market prices');
  const data = await res.json();
  return (data.assets ?? []) as AssetPrice[];
}

/**
 * Live market prices. The backend serves yfinance data behind a 30s cache and
 * exposes no websocket, so we poll. 15s keeps the UI feeling live while the
 * server cache absorbs the load; refetch on window focus catches users
 * returning to the tab. Shared queryKey means every consumer stays in sync.
 */
export function usePrices() {
  return useQuery({
    queryKey: ['prices'],
    queryFn: fetchPrices,
    refetchInterval: 15_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    staleTime: 10_000,
  });
}

/** One asset by symbol (e.g. "BTC/USD"), kept live via the shared poll. */
export function useAssetPrice(symbol: string) {
  const query = usePrices();
  return {
    ...query,
    price: query.data?.find((a) => a.symbol === symbol),
  };
}
