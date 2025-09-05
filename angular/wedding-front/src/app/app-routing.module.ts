import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DressCodeComponent } from './shared/components/dress-code/dress-code.component';
import { GameComponent } from './shared/components/game/game.component';
import { HomeComponent } from './shared/components/home/home.component';
import { VoyageComponent } from './shared/components/voyage/voyage.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {
    path: 'jeu',
    component: GameComponent
  },
  {
    path: 'dress-code',
    component: DressCodeComponent
  },
  {
    path: 'voyage',
    component: VoyageComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)],
  exports: [RouterModule,
    FormsModule]
})
export class AppRoutingModule { }

