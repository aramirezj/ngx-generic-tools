import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';



import { GTFormModule } from 'projects/ngx-generic-tools/forms/forms.module';
import { SharedService } from 'projects/ngx-generic-tools/shared/shared.service';
import { GTTableModule } from 'projects/ngx-generic-tools/tables/tables.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GTFormService } from 'projects/ngx-generic-tools/forms/form.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    GTFormModule,
    GTTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  providers: [SharedService,GTFormService],
  bootstrap: [AppComponent]
})
export class AppModule { }
