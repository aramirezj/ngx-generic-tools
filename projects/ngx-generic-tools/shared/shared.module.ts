//Angular
import { NgModule } from '@angular/core';
import { TextoSlicePipe } from './pipes/texto-slice.pipe';
import { SharedService } from './shared.service';



@NgModule({
  declarations: [
    TextoSlicePipe
  ],
  imports: [

  ],
  exports: [TextoSlicePipe  ],
  providers:[SharedService]
})
export class GTSharedModule { }
