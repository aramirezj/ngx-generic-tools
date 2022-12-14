//Angular
import { NgModule } from '@angular/core';
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
//Components
import { SelectMaestroComponent } from './select-maestro/select-maestro.component';
import { TableComponent } from './table/table.component';
import { CommonModule } from '@angular/common';
import { ChipsComponent } from './chips/chips.component';
import { SliderMaestroComponent } from './slider-maestro/slider-maestro.component';
import { BuscadorComponent } from './buscador/buscador.component';
import { BotoneraFlotanteComponent } from './botonera-flotante/botonera-flotante.component';


import { EditarGenericoComponent } from './editar-generico/editar-generico.component';
import { MatNativeDateModule } from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { ConversionDirective } from './directives/conversion.directive';



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
  TableComponent,
  SelectMaestroComponent,
  ChipsComponent,
  SliderMaestroComponent,
  BuscadorComponent,
  BotoneraFlotanteComponent,
  EditarGenericoComponent,
  ConversionDirective
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
  ],providers:[]
})
export class NgxGTFormsModule { }
