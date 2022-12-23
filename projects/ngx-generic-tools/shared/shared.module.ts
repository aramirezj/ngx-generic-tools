//Angular
import { NgModule } from '@angular/core';
import { TextoSlicePipe } from './pipes/texto-slice.pipe';
import { GTConfirmacionComponent } from './confirmacion/confirmacion.component';
import { DialogModule } from '@angular/cdk/dialog';


@NgModule({
  declarations: [
    TextoSlicePipe,
    GTConfirmacionComponent
  ],
  imports: [DialogModule],
  exports: [TextoSlicePipe],
  providers: []
})
export class GTSharedModule { }
