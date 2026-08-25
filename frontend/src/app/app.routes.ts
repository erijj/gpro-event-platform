import { Routes } from '@angular/router';
import { UserList } from './features/users/user-list/user-list';
import { UserDetail } from './features/users/user-detail/user-detail';
import { CategoryList } from './features/categories/category-list/category-list';
import { CategoryCreate } from './features/categories/category-create/category-create';
import { CategoryEdit } from './features/categories/category-edit/category-edit';
import { CategoryDetail } from './features/categories/category-detail/category-detail';
import { EventList } from './features/events/event-list/event-list';
import { EventCreate } from './features/events/event-create/event-create';
import { EventEdit } from './features/events/event-edit/event-edit';
import { EventDetail } from './features/events/event-detail/event-detail';
import { RegistrationList } from './features/registrations/registration-list/registration-list';
import { UserEdit } from './features/users/user-edit/user-edit';
import { UserCreate } from './features/users/user-create/user-create';
import { MesInscriptions } from './features/registrations/mes-inscriptions/mes-inscriptions';
import { Login } from './features/auth/login/login';
import { Profile } from './features/profile/profile/profile';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
  // --- Auth ---
  { path: 'login', component: Login },

  // --- Catégories ---
  { path: 'categories/create', component: CategoryCreate, canActivate: [adminGuard] },
  { path: 'categories/:id/edit', component: CategoryEdit, canActivate: [adminGuard] },
  { path: 'categories/:id', component: CategoryDetail },
  { path: 'categories', component: CategoryList },

  // --- Événements ---
  { path: 'events/create', component: EventCreate, canActivate: [adminGuard] },
  { path: 'events/:id/edit', component: EventEdit, canActivate: [adminGuard] },
  { path: 'events/:id', component: EventDetail },
  { path: 'events', component: EventList },

  // --- Utilisateurs (réservé ADMIN) ---
  { path: 'users/create', component: UserCreate, canActivate: [adminGuard] },
  { path: 'users/:id/edit', component: UserEdit, canActivate: [adminGuard] },
  { path: 'users/:id', component: UserDetail, canActivate: [adminGuard] },
  { path: 'users', component: UserList, canActivate: [adminGuard] },

  // --- Inscriptions (réservé connecté) ---
  { path: 'registrations', component: RegistrationList, canActivate: [adminGuard] },
  { path: 'mes-inscriptions', component: MesInscriptions, canActivate: [authGuard] },

  // --- Profil (réservé connecté) ---
  { path: 'profil', component: Profile, canActivate: [authGuard] },

  // --- Redirection par défaut ---
  { path: '', redirectTo: 'events', pathMatch: 'full' }
];