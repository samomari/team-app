export type User = {
  id: string;
  status: string | null;
  email: string;
  password: string;
  accessToken: string | null;
  lastLogin: Date;
  createdAt: Date;
};
