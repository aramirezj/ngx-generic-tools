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
import  {MatSliderModule} from '@angular/material/slider';
//Components
import { SelectMaestroComponent } from './select-maestro/select-maestro.component';
import { TableComponent } from './table/table.component';
import { CommonModule } from '@angular/common';
import { ChipsComponent } from './chips/chips.component';
import { SliderMaestroComponent } from './slider-maestro/slider-maestro.component';
import { BuscadorComponent } from './buscador/buscador.component';

const materialModules: any[] = [
  MatFormFieldModule,
  MatSelectModule,
  MatInputModule,
  MatIconModule,
  MatButtonModule,
  MatChipsModule,
  MatSliderModule
];

const components: any[] = [
  TableComponent,
  SelectMaestroComponent,
  ChipsComponent,
  SliderMaestroComponent,
  BuscadorComponent
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
  ]
})
export class NgxGTFormsModule { }
