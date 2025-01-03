export interface User {
  id: string;
  name: string;
  email: string;
  company: Company;
  profilePicUrl: string;
}

export interface CustomToken {
  user?: {
    name?: string;
    email?: string;
  };
}

export interface Company {
  id: string;
  name: string;
}
