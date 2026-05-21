export interface LoginResponse {
  access_token: string;
  user: {
    username: string;
    email: string;
    role: string;
    tenantId: string;
  };
}
