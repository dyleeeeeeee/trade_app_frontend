import { useState, useEffect } from 'react';
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
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
// import QRCode from 'react-qr-code'; // Will add when library is available

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
  }, []);

  const fetchWalletData = async () => {
    try {
      setInitialLoading(true);
      setError(null);

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
        setError('Failed to load wallet data. Please try again.');
        toast.error('Failed to load wallet data');
      }
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
      setError('Network error. Please check your connection and try again.');
      toast.error('Network error. Please check your connection.');
    } finally {
      setInitialLoading(false);
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
        toast.success('Withdrawal request submitted');
        setWithdrawAmount('');
        setWithdrawalNetwork('');
        setWithdrawalAddress('');
        fetchWalletData();
      } else {
        toast.error('Withdrawal failed');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    setLoading(true);
    try {
      const response = await walletAPI.transfer(transferRecipient, parseFloat(transferAmount));
      if (response.ok) {
        toast.success('Transfer successful!');
        setTransferRecipient('');
        setTransferAmount('');
        fetchWalletData();
      } else {
        toast.error('Transfer failed');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="h-3 w-3" /> Approved
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/20">
            <Clock className="h-3 w-3" /> Pending
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/15 text-red-400 border border-red-500/20">
            <XCircle className="h-3 w-3" /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Wallet</h1>
          <p className="text-muted-foreground mt-1">Manage your funds and transactions</p>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="bg-destructive/10 border-destructive/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <p className="text-destructive">{error}</p>
                <Button variant="outline" size="sm" onClick={fetchWalletData}>
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Balance Card */}
        <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm overflow-hidden relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-wider text-slate-400 font-medium">
              <WalletIcon className="h-4 w-4" />
              Available Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl md:text-5xl font-bold text-foreground font-mono tracking-tight">
              {initialLoading ? (
                <span className="shimmer inline-block h-12 w-48 rounded-lg" />
              ) : (
                <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Last updated: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </CardContent>
        </Card>

        {/* Transactions Tabs */}
        <Tabs defaultValue="deposit" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-slate-900/60 border border-slate-700/40 p-1 rounded-xl">
            <TabsTrigger value="deposit" className="data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-400 rounded-lg font-semibold">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw" className="data-[state=active]:bg-orange-500/15 data-[state=active]:text-orange-400 rounded-lg font-semibold">Withdraw</TabsTrigger>
            <TabsTrigger value="transfer" className="data-[state=active]:bg-blue-500/15 data-[state=active]:text-blue-400 rounded-lg font-semibold">Transfer</TabsTrigger>
          </TabsList>

          <TabsContent value="deposit">
            <div className="space-y-6">
              {/* Deposit Instructions Modal */}
              <Dialog open={depositModalOpen} onOpenChange={setDepositModalOpen}>
                <DialogTrigger asChild>
                  <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm cursor-pointer hover:shadow-glow">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <ArrowDownRight className="h-5 w-5 text-success" />
                        <span>Deposit Funds</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Click here to view deposit instructions and generate payment details
                      </p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                      <QrCode className="h-5 w-5" />
                      <span>Deposit Instructions</span>
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-4">
                        Send cryptocurrency to the address below. Deposits are usually confirmed within 10-30 minutes.
                      </p>
                      
                      {/* QR Code Placeholder - Will replace with actual QR when library is available */}
                      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 mx-auto w-48 h-48 flex items-center justify-center">
                        <div className="text-center">
                          <QrCode className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                          <p className="text-xs text-gray-500">QR Code</p>
                          <p className="text-xs text-gray-400 mt-1">Will show payment QR</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Wallet Address (BTC)</Label>
                        <div className="flex items-center space-x-2 p-3 bg-slate-900/40 rounded-xl border border-slate-700/30">
                          <code className="flex-1 text-sm font-mono break-all">
                            {/* bc1qnyzz76de0sqn5ufyq22ued4dk0qh7jlf40megw bc1q4lx9tptr58cld78g7cev7y9f6jfgcfrzcnmudt */}
                            bc1qnyzz76de0sqn5ufyq22ued4dk0qh7jlf40megw
                          </code>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText('bc1qndh646ztj08nzmtshmsl5wmlq7kn7kad0vx8wl');
                              toast.success('Address copied to clipboard!');
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2 mt-4">
                        <Label className="text-sm font-medium">Deposit Instructions</Label>
                        <div className="text-left space-y-2 text-sm text-muted-foreground">
                          <p>1. Copy the Bitcoin address above</p>
                          <p>2. Send BTC from your wallet to this address</p>
                          <p>3. Wait for 1 confirmation (usually 10-30 minutes)</p>
                          <p>4. Funds will automatically appear in your balance</p>
                        </div>
                      </div>

                      <div className="flex space-x-2 mt-6">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setDepositModalOpen(false)}
                        >
                          Close
                        </Button>
                        <Button 
                          className="flex-1 bg-success hover:bg-success/80"
                          onClick={() => {
                            window.open('https://www.blockchain.com/explorer', '_blank');
                            toast.success('Blockchain explorer opened!');
                          }}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Track Payment
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Deposit History */}
              <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Deposit History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {deposits.length > 0 ? (
                      deposits.map((deposit: any, index: number) => (
                        <div key={deposit.id || index} className="flex items-center justify-between p-3 bg-slate-900/40 rounded-xl border border-slate-700/30">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-success/10">
                              <ArrowDownRight className="h-4 w-4 text-success" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                ${deposit.amount}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(deposit.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs px-2 py-1 rounded-full bg-success/20 text-success">
                              Completed
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No deposit history yet. Make your first deposit using the button above.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="withdraw">
            <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ArrowUpRight className="h-5 w-5 text-loss" />
                  <span>Withdraw Funds</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="withdrawAmount">Amount (USD)</Label>
                  <Input
                    id="withdrawAmount"
                    type="number"
                    placeholder="Enter amount"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="bg-slate-900/50 border-slate-700/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Network</Label>
                  <Select value={withdrawalNetwork} onValueChange={setWithdrawalNetwork}>
                    <SelectTrigger className="bg-slate-900/50 border-slate-700/50">
                      <SelectValue placeholder="Select network" />
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

                <div className="space-y-2">
                  <Label htmlFor="walletAddress">Wallet Address</Label>
                  <Input
                    id="walletAddress"
                    placeholder="Enter your wallet address"
                    value={withdrawalAddress}
                    onChange={(e) => setWithdrawalAddress(e.target.value)}
                    className="bg-slate-900/50 border-slate-700/50"
                  />
                </div>

                <Button 
                  onClick={handleWithdraw}
                  disabled={loading || !withdrawAmount || !withdrawalNetwork || !withdrawalAddress}
                  className="w-full bg-gradient-primary hover:shadow-glow"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Request Withdrawal'
                  )}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Withdrawals require admin approval and may take 1-2 business days.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transfer">
            <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Send className="h-5 w-5 text-primary" />
                  <span>Transfer Funds</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient Email</Label>
                  <Input
                    id="recipient"
                    type="email"
                    placeholder="recipient@example.com"
                    value={transferRecipient}
                    onChange={(e) => setTransferRecipient(e.target.value)}
                    className="bg-slate-900/50 border-slate-700/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transferAmount">Amount (USD)</Label>
                  <Input
                    id="transferAmount"
                    type="number"
                    placeholder="Enter amount"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="bg-slate-900/50 border-slate-700/50"
                  />
                </div>
                <Button 
                  onClick={handleTransfer}
                  disabled={loading || !transferRecipient || !transferAmount}
                  className="w-full bg-gradient-primary hover:shadow-glow"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Transfer'
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Withdrawal History */}
        <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Withdrawal History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {withdrawals.length > 0 ? (
                withdrawals.map((withdrawal: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-900/40 rounded-xl border border-slate-700/30">
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(withdrawal.status)}
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          ${withdrawal.amount}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {withdrawal.network ? withdrawal.network.toUpperCase() : 'Unknown'} • {withdrawal.wallet_address ? `${withdrawal.wallet_address.substring(0, 6)}...` : ''}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(withdrawal.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      withdrawal.status === 'approved' && "bg-success/20 text-success",
                      withdrawal.status === 'pending' && "bg-warning/20 text-warning",
                      withdrawal.status === 'rejected' && "bg-loss/20 text-loss"
                    )}>
                      {withdrawal.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No withdrawal history yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}