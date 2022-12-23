//Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
//Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
//Components
import { GTSelectMaestroComponent } from './select-maestro/select-maestro.component';
import { GTChipsComponent } from './chips/chips.component';
import { GTBotoneraComponent } from './botonera-flotante/botonera-flotante.component';
import { GTGenericEditorComponent } from './editar-generico/editar-generico.component';

import { GTConversionDirective } from './directives/conversion.directive';
import { GTMatErrorMessagesDirective } from './directives/matErrorMessages.directive';
import { DialogModule } from '@angular/cdk/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';



const materialModules: any[] = [
  MatFormFieldModule,
  MatSelectModule,
  MatInputModule,
  MatIconModule,
  MatTooltipModule,
  MatSnackBarModule,
  MatAutocompleteModule,
  DialogModule,
  MatDatepickerModule,
  MatNativeDateModule
  
];

const components: any[] = [
  GTSelectMaestroComponent,
  GTChipsComponent,
  GTBotoneraComponent,
  GTGenericEditorComponent,
  GTConversionDirective,
  GTMatErrorMessagesDirective
]

/** Module for forms componentes and utilities */
@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...materialModules
  ],
  exports: [
    ...components,
    ...materialModules
  ], providers: []
})
export class GTFormModule { }
