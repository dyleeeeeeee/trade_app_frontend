import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { walletAPI } from '@/lib/api';
import { toast } from 'sonner';
import {
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownRight,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  QrCode,
  Copy,
  ExternalLink,
  DollarSign,
  Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';
// import QRCode from 'react-qr-code'; // Will add when library is available

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5, ease: [0, 0, 0.2, 1] as [number, number, number, number] },
};

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [withdrawals, setWithdrawals] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [transferRecipient, setTransferRecipient] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawalNetwork, setWithdrawalNetwork] = useState('');
  const [withdrawalAddress, setWithdrawalAddress] = useState('');

  useEffect(() => {
    fetchWalletData();
    // Keep the balance live without re-triggering the full-page loader.
    const interval = setInterval(() => fetchWalletData({ silent: true }), 15_000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchWalletData = async ({ silent = false }: { silent?: boolean } = {}) => {
    try {
      if (!silent) {
        setInitialLoading(true);
        setError(null);
      }

      const [balanceRes, withdrawalsRes, depositsRes] = await Promise.all([
        walletAPI.getBalance(),
        walletAPI.getWithdrawals(),
        walletAPI.getDeposits()
      ]);

      // Handle balance
      if (balanceRes.ok) {
        const data = await balanceRes.json();
        setBalance(data.balance || 0);
      } else {
        console.error('Failed to fetch balance');
        setBalance(0);
      }

      // Handle withdrawals
      if (withdrawalsRes.ok) {
        const data = await withdrawalsRes.json();
        setWithdrawals(data.withdrawals || []);
      } else {
        console.error('Failed to fetch withdrawals');
        setWithdrawals([]);
      }

      // Handle deposits
      if (depositsRes.ok) {
        const data = await depositsRes.json();
        setDeposits(data.deposits || []);
      } else {
        console.error('Failed to fetch deposits');
        setDeposits([]);
      }

      // If all requests failed, show error
      if (!balanceRes.ok && !withdrawalsRes.ok && !depositsRes.ok) {
        setError('We couldn’t load your wallet. Try again.');
        toast.error('We couldn’t load your wallet');
      }
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
      if (!silent) {
        setError('Check your connection and try again.');
        toast.error('Check your connection and try again');
      }
    } finally {
      if (!silent) setInitialLoading(false);
    }
  };

  const handleDeposit = async () => {
    // Open deposit modal instead of processing deposit
    setDepositModalOpen(true);
  };

  const handleWithdraw = async () => {
    console.log('Submitting withdrawal:', {
      amount: withdrawAmount,
      network: withdrawalNetwork,
      address: withdrawalAddress
    });
    setLoading(true);
    try {
      const response = await walletAPI.withdraw(parseFloat(withdrawAmount), withdrawalNetwork, withdrawalAddress);
      if (response.ok) {
        toast.success('Withdrawal requested');
        setWithdrawAmount('');
        setWithdrawalNetwork('');
        setWithdrawalAddress('');
        fetchWalletData();
      } else {
        toast.error('We couldn’t submit your withdrawal');
      }
    } catch (error) {
      toast.error('Check your connection and try again');
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    setLoading(true);
    try {
      const response = await walletAPI.transfer(transferRecipient, parseFloat(transferAmount));
      if (response.ok) {
        toast.success('Transfer sent');
        setTransferRecipient('');
        setTransferAmount('');
        fetchWalletData();
      } else {
        toast.error('We couldn’t send your transfer');
      }
    } catch (error) {
      toast.error('Check your connection and try again');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-caption font-semibold bg-feedback-success/10 text-feedback-success border border-feedback-success/20">
            <CheckCircle className="h-3 w-3" /> Approved
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-caption font-semibold bg-interactive/10 text-interactive border border-interactive/20">
            <Clock className="h-3 w-3" /> Pending
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-caption font-semibold bg-feedback-error/10 text-feedback-error border border-feedback-error/20">
            <XCircle className="h-3 w-3" /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6 sm:gap-8">
        {/* Header */}
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-caption uppercase text-text-tertiary">Funds</span>
          <h1 className="text-h1 text-text-primary">Wallet</h1>
          <p className="text-body text-text-secondary">Add, withdraw, and send funds.</p>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="border-feedback-error/20 bg-feedback-error/10 p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <p className="min-w-0 text-body-sm text-feedback-error">{error}</p>
              <Button variant="secondary" size="sm" className="shrink-0" onClick={() => fetchWalletData()}>
                Retry
              </Button>
            </div>
          </Card>
        )}

        {/* Balance Hero — Apple Wallet card */}
        <motion.div {...reveal}>
          <Card className="liquid-glass relative overflow-hidden p-6 sm:p-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/20" />
            <div className="flex flex-col gap-5 sm:gap-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="glass-inset flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
                    <WalletIcon className="h-5 w-5 text-interactive" />
                  </div>
                  <span className="truncate text-caption uppercase text-text-tertiary">Available balance</span>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-feedback-success/10 px-3 py-1 text-caption font-semibold text-feedback-success">
                  <ArrowUpRight className="h-3.5 w-3.5" /> Live
                </span>
              </div>

              <div className="min-w-0 break-words font-mono tabular-nums text-display font-semibold tracking-tight text-text-primary">
                {initialLoading ? (
                  <span className="shimmer inline-block h-14 w-56 max-w-full rounded-xl bg-white/[0.06]" />
                ) : (
                  <>${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</>
                )}
              </div>

              <p className="text-caption text-text-tertiary">
                Updated {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Transactions Tabs */}
        <motion.div {...reveal}>
          <Tabs defaultValue="deposit" className="flex flex-col gap-6">
            <TabsList className="glass-inset grid w-full grid-cols-3 gap-1 rounded-full p-1">
              <TabsTrigger
                value="deposit"
                className="min-w-0 truncate rounded-full text-body-sm font-medium text-text-secondary data-[state=active]:bg-white/[0.10] data-[state=active]:text-text-primary"
              >
                Deposit
              </TabsTrigger>
              <TabsTrigger
                value="withdraw"
                className="min-w-0 truncate rounded-full text-body-sm font-medium text-text-secondary data-[state=active]:bg-white/[0.10] data-[state=active]:text-text-primary"
              >
                Withdraw
              </TabsTrigger>
              <TabsTrigger
                value="transfer"
                className="min-w-0 truncate rounded-full text-body-sm font-medium text-text-secondary data-[state=active]:bg-white/[0.10] data-[state=active]:text-text-primary"
              >
                Send
              </TabsTrigger>
            </TabsList>

            <TabsContent value="deposit">
              <div className="flex flex-col gap-6">
                {/* Deposit Instructions Modal */}
                <Dialog open={depositModalOpen} onOpenChange={setDepositModalOpen}>
                  <DialogTrigger asChild>
                    <Card interactive className="cursor-pointer p-4 sm:p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-feedback-success/10">
                          <ArrowDownRight className="h-5 w-5 text-feedback-success" />
                        </div>
                        <div className="flex min-w-0 flex-col gap-0.5">
                          <h3 className="text-h3 text-text-primary">Add funds</h3>
                          <p className="text-body-sm text-text-secondary">
                            See where to send your deposit and how to track it.
                          </p>
                        </div>
                      </div>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-h3 text-text-primary">
                        <QrCode className="h-5 w-5 text-interactive" />
                        <span>Add funds</span>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-6">
                      <p className="text-body-sm text-text-secondary">
                        Send crypto to the address below. Deposits usually confirm in 10 to 30 minutes.
                      </p>

                      {/* QR Code Placeholder - Will replace with actual QR when library is available */}
                      <div className="glass-inset mx-auto flex h-48 w-48 items-center justify-center rounded-xl">
                        <div className="flex flex-col items-center gap-2 text-center">
                          <QrCode className="h-12 w-12 text-text-tertiary" />
                          <p className="text-caption text-text-secondary">QR code</p>
                          <p className="text-caption text-text-tertiary">Scan to deposit</p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label>Bitcoin address (BTC)</Label>
                        <div className="glass-inset flex items-center gap-2 rounded-xl p-3">
                          <code className="min-w-0 flex-1 break-all font-mono text-body-sm text-text-primary">
                            {/* bc1qnyzz76de0sqn5ufyq22ued4dk0qh7jlf40megw bc1q4lx9tptr58cld78g7cev7y9f6jfgcfrzcnmudt */}
                            bc1qnyzz76de0sqn5ufyq22ued4dk0qh7jlf40megw
                          </code>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="shrink-0"
                            aria-label="Copy Bitcoin address"
                            onClick={() => {
                              navigator.clipboard.writeText('bc1qndh646ztj08nzmtshmsl5wmlq7kn7kad0vx8wl');
                              toast.success('Address copied');
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label>How to deposit</Label>
                        <div className="flex flex-col gap-2 text-body-sm text-text-secondary">
                          <p>1. Copy the Bitcoin address above.</p>
                          <p>2. Send BTC from your wallet to it.</p>
                          <p>3. Wait for one confirmation, usually 10 to 30 minutes.</p>
                          <p>4. Your balance updates automatically.</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          variant="secondary"
                          className="flex-1"
                          onClick={() => setDepositModalOpen(false)}
                        >
                          Done
                        </Button>
                        <Button
                          variant="primary"
                          className="flex-1"
                          onClick={() => {
                            window.open('https://www.blockchain.com/explorer', '_blank');
                            toast.success('Opening blockchain explorer');
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                          Track deposit
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Deposit History */}
                <Card className="overflow-hidden p-4 sm:p-6">
                  <div className="flex flex-col gap-4">
                    <h3 className="text-h3 text-text-primary">Deposits</h3>
                    <div className="flex flex-col gap-3">
                      {deposits.length > 0 ? (
                        deposits.map((deposit: any, index: number) => (
                          <div key={deposit.id || index} className="glass-inset flex items-center justify-between gap-3 rounded-xl p-4">
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-feedback-success/10">
                                <ArrowDownRight className="h-4 w-4 text-feedback-success" />
                              </div>
                              <div className="flex min-w-0 flex-col gap-0.5">
                                <p className="truncate font-mono tabular-nums text-body-sm font-medium text-text-primary">
                                  ${deposit.amount}
                                </p>
                                <p className="truncate text-caption text-text-tertiary">
                                  {new Date(deposit.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <span className="shrink-0 rounded-full bg-feedback-success/10 px-2.5 py-1 text-caption font-semibold text-feedback-success">
                              Completed
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="py-6 text-center text-body-sm text-text-tertiary">
                          No deposits yet. Once you add funds, they’ll show up here.
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="withdraw">
              <Card className="overflow-hidden p-4 sm:p-6">
                <div className="flex flex-col gap-6">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="glass-inset flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
                      <ArrowUpRight className="h-5 w-5 text-feedback-error" />
                    </div>
                    <h3 className="truncate text-h3 text-text-primary">Withdraw funds</h3>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="withdrawAmount">Amount (USD)</Label>
                      <Input
                        icon={DollarSign}
                        id="withdrawAmount"
                        type="number"
                        placeholder="0.00"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label>Network</Label>
                      <Select value={withdrawalNetwork} onValueChange={setWithdrawalNetwork}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a network" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                          <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                          <SelectItem value="sol">Solana (SOL)</SelectItem>
                          <SelectItem value="polygon">Polygon (MATIC)</SelectItem>
                          <SelectItem value="usdt_trc20">USDT (TRC20)</SelectItem>
                          <SelectItem value="usdt_erc20">USDT (ERC20)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="walletAddress">Wallet address</Label>
                      <Input
                        icon={WalletIcon}
                        id="walletAddress"
                        placeholder="Where to send your funds"
                        value={withdrawalAddress}
                        onChange={(e) => setWithdrawalAddress(e.target.value)}
                      />
                    </div>

                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleWithdraw}
                      disabled={loading || !withdrawAmount || !withdrawalNetwork || !withdrawalAddress}
                      className="w-full"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending request
                        </>
                      ) : (
                        'Request withdrawal'
                      )}
                    </Button>
                    <p className="text-caption text-text-tertiary">
                      Withdrawals are reviewed before they’re sent. This usually takes one to two business days.
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="transfer">
              <Card className="overflow-hidden p-4 sm:p-6">
                <div className="flex flex-col gap-6">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-interactive/10">
                      <Send className="h-5 w-5 text-interactive" />
                    </div>
                    <h3 className="truncate text-h3 text-text-primary">Send funds</h3>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="recipient">Recipient email</Label>
                      <Input
                        icon={Mail}
                        id="recipient"
                        type="email"
                        placeholder="recipient@example.com"
                        value={transferRecipient}
                        onChange={(e) => setTransferRecipient(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="transferAmount">Amount (USD)</Label>
                      <Input
                        icon={DollarSign}
                        id="transferAmount"
                        type="number"
                        placeholder="0.00"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                      />
                    </div>
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleTransfer}
                      disabled={loading || !transferRecipient || !transferAmount}
                      className="w-full"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending
                        </>
                      ) : (
                        'Send funds'
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Withdrawal History */}
        <motion.div {...reveal}>
          <Card className="overflow-hidden p-4 sm:p-6">
            <div className="flex flex-col gap-4">
              <h3 className="text-h3 text-text-primary">Withdrawals</h3>
              <div className="flex flex-col gap-3">
                {withdrawals.length > 0 ? (
                  withdrawals.map((withdrawal: any, index: number) => (
                    <div key={index} className="glass-inset flex items-center justify-between gap-3 rounded-xl p-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="shrink-0">{getStatusBadge(withdrawal.status)}</span>
                        <div className="flex min-w-0 flex-col gap-0.5">
                          <p className="truncate font-mono tabular-nums text-body-sm font-medium text-text-primary">
                            ${withdrawal.amount}
                          </p>
                          <p className="truncate text-caption text-text-tertiary">
                            {withdrawal.network ? withdrawal.network.toUpperCase() : 'Unknown'} • {withdrawal.wallet_address ? `${withdrawal.wallet_address.substring(0, 6)}...` : ''}
                          </p>
                          <p className="truncate text-caption text-text-tertiary">
                            {new Date(withdrawal.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={cn(
                        "shrink-0 rounded-full px-2.5 py-1 text-caption font-semibold capitalize",
                        withdrawal.status === 'approved' && "bg-feedback-success/10 text-feedback-success",
                        withdrawal.status === 'pending' && "bg-interactive/10 text-interactive",
                        withdrawal.status === 'rejected' && "bg-feedback-error/10 text-feedback-error"
                      )}>
                        {withdrawal.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="py-6 text-center text-body-sm text-text-tertiary">
                    No withdrawals yet. When you withdraw, you’ll see it here.
                  </p>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}
