import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';



import { GTTableModule } from 'ngx-generic-tools/tables';
import { GTFormsModule } from 'projects/ngx-generic-tools/forms/forms.module';
import { SharedService } from 'projects/ngx-generic-tools/shared/shared.service';


@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    GTFormsModule,
    GTTableModule
  ],
  providers: [SharedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
