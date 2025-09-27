const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Helper function to get JWT token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('access_token');
};

// Helper function for API calls with JWT authentication
export async function apiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // If token is invalid/expired, try to refresh it
  if (response.status === 401) {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/api/refresh`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${refreshToken}`,
          },
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          localStorage.setItem('access_token', refreshData.access_token);
          
          // Retry the original request with new token
          headers['Authorization'] = `Bearer ${refreshData.access_token}`;
          return fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
          });
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        // Clear tokens if refresh fails
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
  }

  return response;
}

// Auth API calls
export const authAPI = {
  async login(email: string, password: string) {
    const response = await apiCall('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return response;
  },

  async signup(email: string, password: string) {
    const response = await apiCall('/api/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return response;
  },

  async logout() {
    const response = await apiCall('/api/logout', {
      method: 'POST',
    });
    return response;
  },

  async forgotPassword(email: string) {
    const response = await apiCall('/api/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    return response;
  },

  async getCurrentUser() {
    const response = await apiCall('/api/user', {
      method: 'GET',
    });
    return response;
  },
};

// Wallet API calls
export const walletAPI = {
  async getBalance() {
    const response = await apiCall('/api/wallet', {
      method: 'GET',
    });
    return response;
  },

  async deposit(amount: number) {
    const response = await apiCall('/api/deposit', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
    return response;
  },

  async withdraw(amount: number) {
    const response = await apiCall('/api/withdraw', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
    return response;
  },

  async transfer(recipient: string, amount: number) {
    const response = await apiCall('/api/transfer', {
      method: 'POST',
      body: JSON.stringify({ recipient, amount }),
    });
    return response;
  },

  async getWithdrawals() {
    const response = await apiCall('/api/withdrawals', {
      method: 'GET',
    });
    return response;
  },

  async getDeposits() {
    const response = await apiCall('/api/deposits', {
      method: 'GET',
    });
    return response;
  },
};

// Trading API calls
export const tradingAPI = {
  async placeTrade(asset: string, side: 'buy' | 'sell', size: number) {
    const response = await apiCall('/api/trade', {
      method: 'POST',
      body: JSON.stringify({ asset, side, size }),
    });
    return response;
  },

  async getTrades() {
    const response = await apiCall('/api/trades', {
      method: 'GET',
    });
    return response;
  },

  async getPrices() {
    const response = await apiCall('/api/prices', {
      method: 'GET',
    });
    return response;
  },

  async subscribeToTrader(traderId: string, allocation: number) {
    const response = await apiCall('/api/copy/subscribe', {
      method: 'POST',
      body: JSON.stringify({ trader_id: traderId, allocation }),
    });
    return response;
  },

  async getFollowedTraders() {
    const response = await apiCall('/api/copy/subscriptions', {
      method: 'GET',
    });
    return response;
  },
};

// Strategy API calls
export const strategyAPI = {
  async getStrategies() {
    const response = await apiCall('/api/strategies', {
      method: 'GET',
    });
    return response;
  },

  async getMyStrategies() {
    const response = await apiCall('/api/strategies/my-strategies', {
      method: 'GET',
    });
    return response;
  },

  async subscribeToStrategy(strategyId: number, investedAmount: number) {
    const response = await apiCall(`/api/strategies/${strategyId}/subscribe`, {
      method: 'POST',
      body: JSON.stringify({ invested_amount: investedAmount }),
    });
    return response;
  },

  async unsubscribeFromStrategy(strategyId: number) {
    const response = await apiCall(`/api/strategies/${strategyId}/unsubscribe`, {
      method: 'POST',
    });
    return response;
  },
};
export const adminAPI = {
  async getUsers() {
    const response = await apiCall('/api/admin/users', {
      method: 'GET',
    });
    return response;
  },

  async blockUser(userId: string, block: boolean) {
    const response = await apiCall(`/api/admin/users/${userId}/block`, {
      method: 'POST',
      body: JSON.stringify({ block }),
    });
    return response;
  },

  async getAllWithdrawals() {
    const response = await apiCall('/api/admin/withdrawals', {
      method: 'GET',
    });
    return response;
  },

  async approveWithdrawal(withdrawalId: string) {
    const response = await apiCall(`/api/admin/withdrawals/${withdrawalId}/approve`, {
      method: 'POST',
    });
    return response;
  },

  async updateUserBalance(userId: string, balance: number) {
    const response = await apiCall(`/api/admin/users/${userId}/balance`, {
      method: 'POST',
      body: JSON.stringify({ balance }),
    });
    return response;
  },

  async getUserBalance(userId: string) {
    const response = await apiCall(`/api/admin/users/${userId}/balance-info`, {
      method: 'GET',
    });
    return response;
  },
};