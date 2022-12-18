//Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GTAccionTablaComponent } from './accion-tabla/accion-tabla.component';
import { GTElementoTablaComponent } from './elemento-tabla/elemento-tabla.component';

import { NgxGTSharedModule } from 'ngx-generic-tools/shared';
import { NgxGTFormsModule } from 'ngx-generic-tools/forms';
import { GTTablaComponent } from './tabla/tabla.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { GTTablaInfinitaComponent } from './tabla-infinita/tabla-infinita.component';



const components = [
  GTAccionTablaComponent,
  GTElementoTablaComponent,
  GTTablaComponent,
  GTTablaInfinitaComponent
]

const materialModules = [
  MatIconModule,
  MatTooltipModule,
  MatCheckboxModule,
  MatPaginatorModule,
  MatMenuModule
]

@NgModule({
  declarations: [
    components
  ],
  imports: [
    NgxGTSharedModule,
    NgxGTFormsModule,
    CommonModule,
    ...materialModules
  ],
  exports: components,
  providers: []
})
export class GTTableModule { }
