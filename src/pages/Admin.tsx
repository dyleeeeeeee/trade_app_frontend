import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { adminAPI, walletAPI } from '@/lib/api';
import { toast } from 'sonner';
import { Shield, Users, DollarSign, CheckCircle, XCircle, Clock, Loader2, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, useReducedMotion } from 'framer-motion';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [balanceModalOpen, setBalanceModalOpen] = useState(false);
  const [profitModalOpen, setProfitModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newBalance, setNewBalance] = useState('');
  const [newProfit, setNewProfit] = useState('');
  const reduce = useReducedMotion();

  const rise = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 12 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-60px' },
          transition: { duration: 0.5, ease: [0, 0, 0.2, 1] as const, delay },
        };

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
        toast.success(`User ${block ? 'blocked' : 'unblocked'}`);
        fetchAdminData();
      }
    } catch (error) {
      toast.error("Couldn't update this user. Try again.");
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
      toast.error("Couldn't approve this withdrawal. Try again.");
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
        toast.success(`Balance changed from $${data.previous_balance} to $${data.new_balance}`);
        setBalanceModalOpen(false);
        setNewBalance('');
        setSelectedUser(null);
        fetchAdminData();
      } else {
        toast.error("Couldn't update the balance. Try again.");
      }
    } catch (error) {
      toast.error("Couldn't update the balance. Try again.");
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
        toast.success(`P&L changed from $${data.previous_profit} to $${data.new_profit}`);
        setProfitModalOpen(false);
        setNewProfit('');
        setSelectedUser(null);
        fetchAdminData();
      } else {
        toast.error("Couldn't update P&L. Try again.");
      }
    } catch (error) {
      toast.error("Couldn't update P&L. Try again.");
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

  const pendingWithdrawals = withdrawals.filter((w: any) => w.status === 'pending');

  return (
    <Layout>
      <div className="flex flex-col gap-6 sm:gap-8">
        {/* Page header */}
        <motion.header {...rise()} className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-interactive/15 text-interactive">
              <Shield className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <div className="flex flex-col gap-0.5">
              <p className="text-caption uppercase text-text-tertiary">Console</p>
              <h1 className="text-h1 text-text-primary">Admin</h1>
            </div>
          </div>
          <p className="text-body text-text-secondary">Manage users and review withdrawals.</p>
        </motion.header>

        {/* Withdrawal Management */}
        <motion.section {...rise(0.05)}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-text-tertiary" strokeWidth={1.5} aria-hidden="true" />
                <span>Pending withdrawals</span>
                <Badge variant="warning" className="ml-1">{pendingWithdrawals.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {pendingWithdrawals.map((withdrawal: any) => (
                  <div
                    key={withdrawal.id}
                    className="glass-inset flex items-center justify-between gap-3 rounded-xl p-4 sm:gap-4"
                  >
                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-feedback-warning/15 text-feedback-warning">
                        <Clock className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                      </span>
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <p className="font-mono tabular-nums text-body font-semibold text-text-primary">
                          ${withdrawal.amount}
                        </p>
                        <p className="truncate text-body-sm text-text-secondary">{withdrawal.user_email}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleApproveWithdrawal(withdrawal.id)}
                      disabled={loading}
                      size="sm"
                      className="shrink-0"
                      aria-label={`Approve withdrawal of $${withdrawal.amount} for ${withdrawal.user_email}`}
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                        <>
                          <CheckCircle className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                          Approve
                        </>
                      )}
                    </Button>
                  </div>
                ))}
                {pendingWithdrawals.length === 0 && (
                  <div className="glass-inset flex flex-col items-center gap-2 rounded-xl px-6 py-10 text-center">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-feedback-success/15 text-feedback-success">
                      <CheckCircle className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <p className="text-body-sm text-text-secondary">No withdrawals waiting for review.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* User Management */}
        <motion.section {...rise(0.1)}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-text-tertiary" strokeWidth={1.5} aria-hidden="true" />
                <span>Users</span>
                <Badge variant="neutral" className="ml-1">{users.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="-mx-6 overflow-x-auto px-6">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Email</TableHead>
                    <TableHead className="whitespace-nowrap text-right">Balance</TableHead>
                    <TableHead className="whitespace-nowrap text-right">P&L</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="whitespace-nowrap">Role</TableHead>
                    <TableHead className="whitespace-nowrap text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell className="whitespace-nowrap text-text-primary">{user.email}</TableCell>
                      <TableCell className="whitespace-nowrap text-right font-mono tabular-nums font-medium text-feedback-success">
                        ${user.balance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-right font-mono tabular-nums font-medium text-feedback-success">
                        ${user.profit?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant={user.blocked ? 'error' : 'success'}>
                          {user.blocked ? 'Blocked' : 'Active'}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant={user.role === 'admin' ? 'default' : 'neutral'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => openBalanceModal(user)}
                            disabled={loading}
                            aria-label={`Edit balance for ${user.email}`}
                          >
                            <Edit className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                            Balance
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => openProfitModal(user)}
                            disabled={loading}
                            aria-label={`Edit P&L for ${user.email}`}
                          >
                            <Edit className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                            P&L
                          </Button>
                          <Button
                            variant={user.blocked ? 'secondary' : 'destructive'}
                            size="sm"
                            onClick={() => handleBlockUser(user.id, !user.blocked)}
                            disabled={loading}
                            aria-label={`${user.blocked ? 'Unblock' : 'Block'} ${user.email}`}
                          >
                            {user.blocked ? 'Unblock' : 'Block'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                </Table>
              </div>
              {users.length === 0 && (
                <div className="glass-inset flex flex-col items-center gap-2 rounded-xl px-6 py-10 text-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-overlay text-text-tertiary">
                    <Users className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <p className="text-body-sm text-text-secondary">No users yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.section>

        {/* Balance Edit Modal */}
        <Dialog open={balanceModalOpen} onOpenChange={setBalanceModalOpen}>
          <DialogContent className="w-[calc(100%-2rem)] max-w-[calc(100%-2rem)] p-4 sm:max-w-md sm:p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-text-tertiary" strokeWidth={1.5} aria-hidden="true" />
                <span>Edit balance</span>
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-5">
              {selectedUser && (
                <div className="flex flex-col gap-5">
                  <div className="glass-inset rounded-xl p-4">
                    <p className="text-caption uppercase text-text-tertiary">User</p>
                    <p className="break-all text-body font-medium text-text-primary">{selectedUser.email}</p>
                    <p className="mt-2 text-body-sm text-text-secondary">
                      Current balance:{' '}
                      <span className="font-mono tabular-nums font-medium text-feedback-success">
                        ${selectedUser.balance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="newBalance">New balance (USD)</Label>
                    <Input
                      id="newBalance"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={newBalance}
                      onChange={(e) => setNewBalance(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
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
                      className="flex-1"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving
                        </>
                      ) : (
                        'Save balance'
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
          <DialogContent className="w-[calc(100%-2rem)] max-w-[calc(100%-2rem)] p-4 sm:max-w-md sm:p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-text-tertiary" strokeWidth={1.5} aria-hidden="true" />
                <span>Edit P&L</span>
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-5">
              {selectedUser && (
                <div className="flex flex-col gap-5">
                  <div className="glass-inset rounded-xl p-4">
                    <p className="text-caption uppercase text-text-tertiary">User</p>
                    <p className="break-all text-body font-medium text-text-primary">{selectedUser.email}</p>
                    <p className="mt-2 text-body-sm text-text-secondary">
                      Current P&L:{' '}
                      <span className="font-mono tabular-nums font-medium text-feedback-success">
                        ${selectedUser.profit?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="newProfit">New P&L (USD)</Label>
                    <Input
                      id="newProfit"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newProfit}
                      onChange={(e) => setNewProfit(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
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
                      className="flex-1"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving
                        </>
                      ) : (
                        'Save P&L'
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