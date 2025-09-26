const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper function for API calls with credentials
export async function apiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include', // Always include cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  return response;
}

// Auth API calls
export const authAPI = {
  async login(email: string, password: string) {
    const response = await apiCall('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return response;
  },

  async signup(email: string, password: string) {
    const response = await apiCall('/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return response;
  },

  async logout() {
    const response = await apiCall('/logout', {
      method: 'POST',
    });
    return response;
  },

  async forgotPassword(email: string) {
    const response = await apiCall('/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    return response;
  },

  async getCurrentUser() {
    const response = await apiCall('/user', {
      method: 'GET',
    });
    return response;
  },
};

// Wallet API calls
export const walletAPI = {
  async getBalance() {
    const response = await apiCall('/wallet', {
      method: 'GET',
    });
    return response;
  },

  async deposit(amount: number) {
    const response = await apiCall('/deposit', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
    return response;
  },

  async withdraw(amount: number) {
    const response = await apiCall('/withdraw', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
    return response;
  },

  async transfer(recipient: string, amount: number) {
    const response = await apiCall('/transfer', {
      method: 'POST',
      body: JSON.stringify({ recipient, amount }),
    });
    return response;
  },

  async getWithdrawals() {
    const response = await apiCall('/withdrawals', {
      method: 'GET',
    });
    return response;
  },

  async getDeposits() {
    const response = await apiCall('/deposits', {
      method: 'GET',
    });
    return response;
  },
};

// Trading API calls
export const tradingAPI = {
  async placeTrade(asset: string, side: 'buy' | 'sell', size: number) {
    const response = await apiCall('/trade', {
      method: 'POST',
      body: JSON.stringify({ asset, side, size }),
    });
    return response;
  },

  async getTrades() {
    const response = await apiCall('/trades', {
      method: 'GET',
    });
    return response;
  },

  async getPrices() {
    const response = await apiCall('/prices', {
      method: 'GET',
    });
    return response;
  },

  async subscribeToTrader(traderId: string, allocation: number) {
    const response = await apiCall('/copy/subscribe', {
      method: 'POST',
      body: JSON.stringify({ trader_id: traderId, allocation }),
    });
    return response;
  },

  async getFollowedTraders() {
    const response = await apiCall('/copy/subscriptions', {
      method: 'GET',
    });
    return response;
  },
};

// Admin API calls
export const adminAPI = {
  async getUsers() {
    const response = await apiCall('/admin/users', {
      method: 'GET',
    });
    return response;
  },

  async blockUser(userId: string, block: boolean) {
    const response = await apiCall(`/admin/users/${userId}/block`, {
      method: 'POST',
      body: JSON.stringify({ block }),
    });
    return response;
  },

  async getAllWithdrawals() {
    const response = await apiCall('/admin/withdrawals', {
      method: 'GET',
    });
    return response;
  },

  async approveWithdrawal(withdrawalId: string) {
    const response = await apiCall(`/admin/withdrawals/${withdrawalId}/approve`, {
      method: 'POST',
    });
    return response;
  },

  async updateUserBalance(userId: string, balance: number) {
    const response = await apiCall(`/admin/users/${userId}/balance`, {
      method: 'POST',
      body: JSON.stringify({ balance }),
    });
    return response;
  },

  async getUserBalance(userId: string) {
    const response = await apiCall(`/admin/users/${userId}/balance-info`, {
      method: 'GET',
    });
    return response;
  },
};