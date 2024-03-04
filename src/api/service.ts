import axios from "axios";

class ApiService {
  private endpoint = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { "Content-Type": "application/json" },
  });

  async getUserInfo(email: string) {
    const info = await this.endpoint.get(`/users/${email}`);
    return info.data;
  }
}

export const api = new ApiService();
