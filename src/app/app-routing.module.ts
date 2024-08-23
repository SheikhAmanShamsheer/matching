import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'properties', pathMatch: 'full', redirectTo: '/properties'},
  { path: 'test', pathMatch: 'full', redirectTo: '/test' },
  { path: '', pathMatch: 'full', redirectTo: '/properties'},
  { path: '**', pathMatch: 'full', redirectTo: '/test' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
