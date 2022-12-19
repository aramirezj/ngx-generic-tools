//Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GTAccionTablaComponent } from './accion-tabla/accion-tabla.component';
import { GTElementoTablaComponent } from './elemento-tabla/elemento-tabla.component';

import { GTSharedModule } from 'ngx-generic-tools/shared';
import { GTTablaComponent } from './tabla/tabla.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { GTTablaInfinitaComponent } from './tabla-infinita/tabla-infinita.component';
import { GTBuscadorComponent } from './buscador/buscador.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';



const components = [
  GTAccionTablaComponent,
  GTElementoTablaComponent,
  GTTablaComponent,
  GTTablaInfinitaComponent,
  GTBuscadorComponent
]

const materialModules = [
  MatIconModule,
  MatTooltipModule,
  MatCheckboxModule,
  MatPaginatorModule,
  MatMenuModule,
  MatFormFieldModule
]

@NgModule({
  declarations: [
    components
  ],
  imports: [
    GTSharedModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ...materialModules
  ],
  exports: components,
  providers: []
})
export class GTTableModule { }
