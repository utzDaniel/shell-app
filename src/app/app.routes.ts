import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { roleGuard } from './core/auth/role.guard';
import { HomeComponent } from './pages/home/home.component';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';
import { ShellLayoutComponent } from './layout/shell-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'perfil',
        canActivate: [roleGuard('USER')],
        loadChildren: () =>
          loadRemoteModule('user-mf', './Routes').then(m => m.routes),
      },
      {
        path: 'finance',
        canActivate: [roleGuard('FINANCE')],
        loadComponent: () =>
          loadRemoteModule('finance-mf', './Component').then(m => m.AppComponent),
      },
      {
        path: 'dashboard',
        canActivate: [roleGuard('DASHBOARD')],
        loadComponent: () =>
          loadRemoteModule('dashboard-mf', './Component').then(m => m.AppComponent),
      },
    ],
  },
  {
    path: 'forbidden',
    component: ForbiddenComponent,
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
