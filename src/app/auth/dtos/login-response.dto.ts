export interface LoginResponse {
  accessToken: string;
  user: {
    username: string;
    email: string;
    role: string;
    tenantId: string;
  };
}
