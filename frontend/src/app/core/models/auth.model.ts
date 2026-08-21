export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
}