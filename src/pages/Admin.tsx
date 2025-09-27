import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { adminAPI, walletAPI } from '@/lib/api';
import { toast } from 'sonner';
import { Shield, Users, DollarSign, CheckCircle, XCircle, Clock, Loader2, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [balanceModalOpen, setBalanceModalOpen] = useState(false);
  const [profitModalOpen, setProfitModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newBalance, setNewBalance] = useState('');
  const [newProfit, setNewProfit] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [usersRes, withdrawalsRes] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getAllWithdrawals()
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        const usersWithData = await Promise.all(
          usersData.users.map(async (user: any) => {
            try {
              const [balanceRes, profitRes] = await Promise.all([
                adminAPI.getUserBalance(user.id),
                adminAPI.getUserProfit(user.id)
              ]);
              const balance = balanceRes.ok ? (await balanceRes.json()).balance || 0 : 0;
              const profit = profitRes.ok ? (await profitRes.json()).profit || 0 : 0;
              return { ...user, balance, profit };
            } catch {
              return { ...user, balance: 0, profit: 0 };
            }
          })
        );
        setUsers(usersWithData);
      }

      if (withdrawalsRes.ok) {
        const data = await withdrawalsRes.json();
        setWithdrawals(data.withdrawals || []);
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    }
  };

  const handleBlockUser = async (userId: string, block: boolean) => {
    setLoading(true);
    try {
      const response = await adminAPI.blockUser(userId, block);
      if (response.ok) {
        toast.success(`User ${block ? 'blocked' : 'unblocked'} successfully`);
        fetchAdminData();
      }
    } catch (error) {
      toast.error('Failed to update user status');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveWithdrawal = async (withdrawalId: string) => {
    setLoading(true);
    try {
      const response = await adminAPI.approveWithdrawal(withdrawalId);
      if (response.ok) {
        toast.success('Withdrawal approved');
        fetchAdminData();
      }
    } catch (error) {
      toast.error('Failed to approve withdrawal');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBalance = async () => {
    if (!selectedUser || !newBalance) return;

    setLoading(true);
    try {
      const response = await adminAPI.updateUserBalance(selectedUser.id, parseFloat(newBalance));
      if (response.ok) {
        const data = await response.json();
        toast.success(`Balance updated from $${data.previous_balance} to $${data.new_balance}`);
        setBalanceModalOpen(false);
        setNewBalance('');
        setSelectedUser(null);
        fetchAdminData();
      } else {
        toast.error('Failed to update balance');
      }
    } catch (error) {
      toast.error('Failed to update balance');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfit = async () => {
    if (!selectedUser || !newProfit) return;

    setLoading(true);
    try {
      const response = await adminAPI.updateUserProfit(selectedUser.id, parseFloat(newProfit));
      if (response.ok) {
        const data = await response.json();
        toast.success(`PNL updated from $${data.previous_profit} to $${data.new_profit}`);
        setProfitModalOpen(false);
        setNewProfit('');
        setSelectedUser(null);
        fetchAdminData();
      } else {
        toast.error('Failed to update PNL');
      }
    } catch (error) {
      toast.error('Failed to update PNL');
    } finally {
      setLoading(false);
    }
  };

  const openBalanceModal = (user: any) => {
    setSelectedUser(user);
    setNewBalance(user.balance?.toString() || '0');
    setBalanceModalOpen(true);
  };

  const openProfitModal = (user: any) => {
    setSelectedUser(user);
    setNewProfit(user.profit?.toString() || '0');
    setProfitModalOpen(true);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage users and platform operations</p>
          </div>
        </div>

        {/* Withdrawal Management */}
        <Card className="bg-gradient-card border-border/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Pending Withdrawals</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {withdrawals.filter((w: any) => w.status === 'pending').map((withdrawal: any) => (
                <div key={withdrawal.id} className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Clock className="h-5 w-5 text-warning" />
                    <div>
                      <p className="font-medium text-foreground">${withdrawal.amount}</p>
                      <p className="text-sm text-muted-foreground">User: {withdrawal.user_email}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleApproveWithdrawal(withdrawal.id)}
                    disabled={loading}
                    className="bg-success hover:bg-success/80"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Approve'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card className="bg-gradient-card border-border/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>User Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Email</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Balance</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">PNL</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Role</th>
                    <th className="text-right p-3 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: any) => (
                    <tr key={user.id} className="border-b border-border/50">
                      <td className="p-3 text-sm text-foreground">{user.email}</td>
                      <td className="p-3 text-sm font-medium text-success">
                        ${user.balance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                      </td>
                      <td className="p-3 text-sm font-medium text-success">
                        ${user.profit?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                      </td>
                      <td className="p-3">
                        <Badge variant={user.blocked ? 'destructive' : 'default'}>
                          {user.blocked ? 'Blocked' : 'Active'}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openBalanceModal(user)}
                          disabled={loading}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit Balance
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openProfitModal(user)}
                          disabled={loading}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit PNL
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBlockUser(user.id, !user.blocked)}
                          disabled={loading}
                        >
                          {user.blocked ? 'Unblock' : 'Block'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Balance Edit Modal */}
        <Dialog open={balanceModalOpen} onOpenChange={setBalanceModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Edit User Balance</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedUser && (
                <div className="space-y-4">
                  <div className="p-4 bg-background/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">User</p>
                    <p className="font-medium">{selectedUser.email}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Current Balance: <span className="text-success font-medium">
                        ${selectedUser.balance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                      </span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newBalance">New Balance (USD)</Label>
                    <Input
                      id="newBalance"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Enter new balance"
                      value={newBalance}
                      onChange={(e) => setNewBalance(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setBalanceModalOpen(false);
                        setSelectedUser(null);
                        setNewBalance('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUpdateBalance}
                      disabled={loading || !newBalance}
                      className="flex-1 bg-success hover:bg-success/80"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Update Balance'
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Profit Edit Modal */}
        <Dialog open={profitModalOpen} onOpenChange={setProfitModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Edit User PNL</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedUser && (
                <div className="space-y-4">
                  <div className="p-4 bg-background/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">User</p>
                    <p className="font-medium">{selectedUser.email}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Current PNL: <span className="text-success font-medium">
                        ${selectedUser.profit?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                      </span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newProfit">New PNL (USD)</Label>
                    <Input
                      id="newProfit"
                      type="number"
                      step="0.01"
                      placeholder="Enter new PNL"
                      value={newProfit}
                      onChange={(e) => setNewProfit(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setProfitModalOpen(false);
                        setSelectedUser(null);
                        setNewProfit('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUpdateProfit}
                      disabled={loading || !newProfit}
                      className="flex-1 bg-success hover:bg-success/80"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Update PNL'
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}