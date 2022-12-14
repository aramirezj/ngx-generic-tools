import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgxGTFormsModule } from 'projects/ngx-generic-tools/forms/forms.module';
import { SharedService } from 'ngx-generic-tools/shared';
import { NgxGTTableModule } from 'projects/ngx-generic-tools/tables/tables.module';


@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgxGTFormsModule,
    NgxGTTableModule
  ],
  providers: [SharedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
