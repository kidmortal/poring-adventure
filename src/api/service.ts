import axios from "axios";

class ApiService {
  private endpoint = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { "Content-Type": "application/json" },
  });

  async getFirst10Users() {
    const info = await this.endpoint.get<User[]>(`/users/`);
    return info.data;
  }

  async getUserInfo(email: string) {
    const info = await this.endpoint.get<User>(`/users/${email}`);
    console.log(info.data);
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
