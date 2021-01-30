import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// { path: '', loadChildren: './pages/login/login.module#LoginPageModule' },
const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
