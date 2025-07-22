// src/admin/interfaces/admin.interface.ts
export interface Admin {
  id: string;
  username: string;
  password: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
