import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
];

@NgModule({
  imports: [
    // Setting to make route changes always scroll to top of page
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      bindToComponentInputs: true,
      paramsInheritanceStrategy: 'always' }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

