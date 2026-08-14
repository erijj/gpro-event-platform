export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
  createdAt: string;
}