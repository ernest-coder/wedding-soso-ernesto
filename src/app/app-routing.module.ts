import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DressCodeComponent } from './shared/components/dress-code/dress-code.component';
import { GameComponent } from './shared/components/game/game.component';
import { HomeComponent } from './shared/components/home/home.component';
import { ProgramComponent } from './shared/components/program/program.component';
import { RsvpComponent } from './shared/components/rsvp/rsvp.component';
import { SejourComponent } from './shared/components/sejour/sejour.component';
import { VoyageComponent } from './shared/components/voyage/voyage.component';
import { WeddingListComponent } from './shared/components/wedding-list/wedding-list.component';

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
  {
    path: 'liste-de-mariage',
    component: WeddingListComponent
  },
  {
    path: 'programme',
    component: ProgramComponent
  },
  {
    path: 'logement',
    component: SejourComponent
  },
  {
    path: 'rsvp',
    component: RsvpComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)],
  exports: [RouterModule,
    FormsModule]
})
export class AppRoutingModule { }

