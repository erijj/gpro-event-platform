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

export const routes: Routes = [
  // --- Catégories ---
  { path: 'categories/create', component: CategoryCreate },
  { path: 'categories/:id/edit', component: CategoryEdit },
  { path: 'categories/:id', component: CategoryDetail },
  { path: 'categories', component: CategoryList },

  // --- Événements ---
  { path: 'events/create', component: EventCreate },
  { path: 'events/:id/edit', component: EventEdit },
  { path: 'events/:id', component: EventDetail },
  { path: 'events', component: EventList },

  // --- Utilisateurs ---
  { path: 'users/create', component: UserCreate },
  { path: 'users/:id/edit', component: UserEdit },
  { path: 'users/:id', component: UserDetail },
  { path: 'users', component: UserList },

  // --- Inscriptions ---
  { path: 'registrations', component: RegistrationList },
  { path: 'mes-inscriptions', component: MesInscriptions },

  // --- Redirection par défaut ---
  { path: '', redirectTo: 'users', pathMatch: 'full' }
];