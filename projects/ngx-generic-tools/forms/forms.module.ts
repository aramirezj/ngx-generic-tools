//Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
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
import { GTFormService } from './form.service';





const materialModules: any[] = [
  MatFormFieldModule,
  MatSelectModule,
  MatInputModule,
  MatIconModule,
  MatTooltipModule,
  MatSnackBarModule,
  MatAutocompleteModule
];

const components: any[] = [
  GTSelectMaestroComponent,
  GTChipsComponent,
  GTBotoneraComponent,
  GTGenericEditorComponent,
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
    ...components
  ], providers: [GTFormService]
})
export class GTFormModule { }
