export interface AcceptInviteRequestDto {
  email: string;
  adminName: string;
  tenant: {
    id: string;
    name: string;
  };
  expiresAt: string;
}
