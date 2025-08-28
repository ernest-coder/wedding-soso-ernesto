import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import localeFr from '@angular/common/locales/fr';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MarkdownModule} from "ngx-markdown";
import { HomeComponent } from './shared/components/home/home.component';
import { TopBarComponent } from './shared/components/top-bar/top-bar.component';

registerLocaleData(localeFr)

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TopBarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    MarkdownModule.forRoot(),
    MatFormFieldModule,
    MatInputModule,
    MatSidenavModule,
    MatToolbarModule,
    MatSlideToggleModule,
  ],
  providers: [
    {provide: LOCALE_ID, useValue: "fr-FR"}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
