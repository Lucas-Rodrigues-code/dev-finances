export class User {
  id: string;
  email: string;
  name: string;
  password: string;
  created_at: Date;
  updated_at: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
} 