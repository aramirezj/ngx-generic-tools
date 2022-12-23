//Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GTAccionTablaComponent } from './accion-tabla/accion-tabla.component';
import { GTElementoTablaComponent } from './elemento-tabla/elemento-tabla.component';

import { GTTableComponent } from './tabla/tabla.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { GTInfiniteTableComponent } from './tabla-infinita/tabla-infinita.component';
import { GTBuscadorComponent } from './buscador/buscador.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';



const components = [
  GTAccionTablaComponent,
  GTElementoTablaComponent,
  GTTableComponent,
  GTInfiniteTableComponent,
  GTBuscadorComponent
]

const materialModules = [
  MatIconModule,
  MatTooltipModule,
  MatCheckboxModule,
  MatPaginatorModule,
  MatMenuModule,
  MatFormFieldModule,
  MatInputModule
]

@NgModule({
  declarations: [
    components
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...materialModules
  ],
  exports: components,
  providers: []
})
export class GTTableModule { }
