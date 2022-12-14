//Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AccionTablaComponent } from './accion-tabla/accion-tabla.component';
import { ElementoTablaComponent } from './elemento-tabla/elemento-tabla.component';

import { NgxGTSharedModule } from 'ngx-generic-tools/shared';
import { NgxGTFormsModule } from 'ngx-generic-tools/forms';
import { TablaComponent } from './tabla/tabla.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { TablaInfinitaComponent } from './tabla-infinita/tabla-infinita.component';



const components = [
  AccionTablaComponent,
  ElementoTablaComponent,
  TablaComponent,
  TablaInfinitaComponent
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
export class NgxGTTableModule { }
