import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './shared/components/game/game.component';
import { HomeComponent } from './shared/components/home/home.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {
    path: 'jeu',
    component: GameComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)],
  exports: [RouterModule,
    FormsModule]
})
export class AppRoutingModule { }

