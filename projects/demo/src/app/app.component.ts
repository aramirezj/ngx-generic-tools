import { Component } from '@angular/core';

import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sample-project';

  constructor() {

  }
  ngOnInit() {
 
    //this.sharedService.muestraConfirmacion('¿Aceptas todos los cargos que se te inputan?').subscribe();
    
  }
}
