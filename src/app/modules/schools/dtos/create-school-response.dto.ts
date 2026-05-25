import { SchoolDto } from './school.dto';

export interface CreateSchoolResponseDto {
  tenant: SchoolDto;
  token: string;
  inviteLink: string;
  invitation: {
    id: string;
    email: string;
    token: string;
    status: string;
    tenant_id: string;
    created_at: string;
    expires_at: string;
  };
  emailSent: boolean;
  brevoMessageId: string;
}
