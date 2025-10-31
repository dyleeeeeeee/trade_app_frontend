import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
    setLoading(true);
    try {
      const response = await walletAPI.withdraw(parseFloat(withdrawAmount));
      if (response.ok) {
        toast.success('Withdrawal request submitted');
        setWithdrawAmount('');
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-loss" />;
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
        <Card className="bg-gradient-card border-border/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <WalletIcon className="h-5 w-5" />
              <span>Available Balance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">
              {initialLoading ? '...' : `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Last updated: {new Date().toLocaleString()}
            </p>
          </CardContent>
        </Card>

        {/* Transactions Tabs */}
        <Tabs defaultValue="deposit" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-card">
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
            <TabsTrigger value="transfer">Transfer</TabsTrigger>
          </TabsList>

          <TabsContent value="deposit">
            <div className="space-y-6">
              {/* Deposit Instructions Modal */}
              <Dialog open={depositModalOpen} onOpenChange={setDepositModalOpen}>
                <DialogTrigger asChild>
                  <Card className="bg-gradient-card border-border/50 backdrop-blur-sm cursor-pointer hover:shadow-glow">
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
                        <div className="flex items-center space-x-2 p-3 bg-background/50 rounded-lg">
                          <code className="flex-1 text-sm font-mono break-all">
                            {/* bc1qc74yhsz3wwnurxxm09nx9z459j0287yeq0kn9z bc1q4lx9tptr58cld78g7cev7y9f6jfgcfrzcnmudt */}
                            bc1qc74yhsz3wwnurxxm09nx9z459j0287yeq0kn9z
                          </code>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText('bc1qc74yhsz3wwnurxxm09nx9z459j0287yeq0kn9z');
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
              <Card className="bg-gradient-card border-border/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Deposit History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {deposits.length > 0 ? (
                      deposits.map((deposit: any, index: number) => (
                        <div key={deposit.id || index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
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
            <Card className="bg-gradient-card border-border/50 backdrop-blur-sm">
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
                    className="bg-background/50"
                  />
                </div>
                <Button 
                  onClick={handleWithdraw}
                  disabled={loading || !withdrawAmount}
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
            <Card className="bg-gradient-card border-border/50 backdrop-blur-sm">
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
                    className="bg-background/50"
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
                    className="bg-background/50"
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
        <Card className="bg-gradient-card border-border/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Withdrawal History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {withdrawals.length > 0 ? (
                withdrawals.map((withdrawal: { amount: number; status: string; created_at: string }, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(withdrawal.status)}
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          ${withdrawal.amount}
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