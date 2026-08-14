import { Routes } from '@angular/router';
import { UserList } from './features/users/user-list/user-list';
import { CategoryList } from './features/categories/category-list/category-list';
import { EventList } from './features/events/event-list/event-list';
import { RegistrationList } from './features/registrations/registration-list/registration-list';
import { EventDetail } from './features/events/event-detail/event-detail';
import { UserDetail } from './features/users/user-detail/user-detail';
import { CategoryDetail } from './features/categories/category-detail/category-detail';
import { CategoryCreate } from './features/categories/category-create/category-create';
import { EventCreate } from './features/events/event-create/event-create';
import { CategoryEdit } from './features/categories/category-edit/category-edit';
import { EventEdit } from './features/events/event-edit/event-edit';



export const routes: Routes = [
  { path: 'users', component: UserList },
  { path: 'categories', component: CategoryList },
  { path: 'events', component: EventList },
  { path: 'registrations', component: RegistrationList },
  { path: 'events/create', component: EventCreate },
  { path: 'events/:id/edit', component: EventEdit },
  { path: 'events/:id', component: EventDetail },
  { path: 'users/:id', component: UserDetail },
  { path: 'categories/create', component: CategoryCreate },
  { path: 'categories/:id/edit', component: CategoryEdit },
  { path: 'categories/:id', component: CategoryDetail },
  { path: '', redirectTo: 'users', pathMatch: 'full' }
];