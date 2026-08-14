import { Category } from './category.model';

export interface Event {
  id: number;
  titre: string;
  description: string;
  dateHeure: string;
  lieu: string;
  capaciteMax: number;
  placesRestantes: number;
  statut: 'PLANIFIE' | 'EN_COURS' | 'TERMINE' | 'ANNULE'; 
  image: string | null;
  category: Category;
}
