//Angular
import { NgModule } from '@angular/core';
import { TextoSlicePipe } from './pipes/texto-slice.pipe';
import { SharedService } from './shared.service';
import { GTConfirmacionComponent } from './confirmacion/confirmacion.component';
import { DialogModule } from '@angular/cdk/dialog';


@NgModule({
  declarations: [
    TextoSlicePipe,
    GTConfirmacionComponent
  ],
  imports: [DialogModule],
  exports: [TextoSlicePipe],
  providers: [SharedService]
})
export class GTSharedModule { }
