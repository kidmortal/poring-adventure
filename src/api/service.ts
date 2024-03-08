import axios from "axios";

class ApiService {
  private endpoint = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { "Content-Type": "application/json" },
  });

  async purchaseMarketListing(args: {
    listingId: number;
    accessToken: string;
  }) {
    const info = await this.endpoint.post(
      `/market/purchase/`,
      {
        marketListingId: args.listingId,
        stack: 1,
      },
      {
        headers: { auth: args.accessToken },
      }
    );
    return info.data;
  }

  async revokeMarketListing(args: { listingId: number; accessToken: string }) {
    const info = await this.endpoint.delete(`/market/${args.listingId}`, {
      headers: { auth: args.accessToken },
    });
    return info.data;
  }

  async getFirst10Users() {
    const info = await this.endpoint.get<User[]>(`/users/`);
    return info.data;
  }

  async getFirst10MarketListing() {
    const info = await this.endpoint.get<MarketListing[]>(`/market/`);
    return info.data;
  }

  async getUserInfo(email: string) {
    const info = await this.endpoint.get<User>(`/users/${email}`);
    return info.data;
  }
  async deleteUser(email: string, accessToken: string) {
    const info = await this.endpoint.delete(`/users/${email}`, {
      headers: { auth: accessToken },
    });
    return info.data;
  }
  async createNewUser(args: CreateUserPayload, accessToken: string) {
    const info = await this.endpoint.post(`/users/`, args, {
      headers: { auth: accessToken },
    });
    return info.data;
  }
}

export const api = new ApiService();
