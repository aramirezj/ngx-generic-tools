//Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
//Components
import { GTSelectMaestroComponent } from './select-maestro/select-maestro.component';
import { GTChipsComponent } from './chips/chips.component';
import { GTSliderMaestroComponent } from './slider-maestro/slider-maestro.component';
import { GTBuscadorComponent } from './buscador/buscador.component';
import { GTBotoneraComponent } from './botonera-flotante/botonera-flotante.component';
import { GTConfirmacionComponent } from './confirmacion/confirmacion.component';
import { GTEditarGenericoComponent } from './editar-generico/editar-generico.component';

import { GTConversionDirective } from './directives/conversion.directive';
import { GTMatErrorMessagesDirective } from './public_api';




const materialModules: any[] = [
  MatFormFieldModule,
  MatSelectModule,
  MatInputModule,
  MatIconModule,
  MatButtonModule,
  MatChipsModule,
  MatSliderModule,
  MatTooltipModule,
  MatDialogModule,
  MatSnackBarModule,
  MatAutocompleteModule,
  MatNativeDateModule,
  MatDatepickerModule
];

const components: any[] = [
  GTSelectMaestroComponent,
  GTChipsComponent,
  GTSliderMaestroComponent,
  GTBuscadorComponent,
  GTBotoneraComponent,
  GTEditarGenericoComponent,
  GTConfirmacionComponent,
  GTConversionDirective,
  GTMatErrorMessagesDirective
]

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...materialModules
  ],
  exports: [
    ...components,
    ...materialModules
  ], providers: []
})
export class GTFormsModule { }
