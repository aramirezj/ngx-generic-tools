//Angular
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
//Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
//Components
import { SelectMaestroComponent } from './select-maestro/select-maestro.component';
import { TableComponent } from './table/table.component';
import { CommonModule } from '@angular/common';

const materialModules:any[] = [
  MatFormFieldModule,
  MatSelectModule,
  MatInputModule,
  MatIconModule,
  MatButtonModule
];

@NgModule({
  declarations: [
    TableComponent,
    SelectMaestroComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...materialModules
  ],
  exports: [
    TableComponent,
    SelectMaestroComponent,
    ...materialModules
  ]
})
export class TableModule { }
