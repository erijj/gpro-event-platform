export interface Registration {
  id: number;
  eventId: number;
  eventTitre: string;
  userId: number;
  userNomComplet: string;
  dateInscription: string;
  statut: 'CONFIRMEE' | 'ANNULEE'; 
}