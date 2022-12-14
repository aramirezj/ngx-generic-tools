import { Component } from '@angular/core';
import { Formulario, TC } from 'ngx-generic-tools/models';
import { SharedService } from 'ngx-generic-tools/shared';
import { TF } from 'projects/ngx-generic-tools/models/public_api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sample-project';

  miForm: Formulario = new Formulario(TF.CREACION, ['nombre', 'fecha'], ['Nombre', 'Fecha'], 'Creación');


  datos:any[] = [{nombre:'xd',apellidos:'omgggg'},{nombre:'xdawdd',apellidos:'omgggggg'},{nombre:'xddd',apellidos:'om  gggg'},{nombre:'ddxd',apellidos:'omgggg'}];
  modelo:string[] =  ['nombre','apellidos'];
  visual:string[] =  ['Nombre','Apellidos'];

  constructor(private sharedService: SharedService) {

  }
  ngOnInit() {
    this.miForm.cambiarTipo(TC.FECHA,['fecha']);
   /* this.sharedService.muestraFormulario(this.miForm).subscribe(resp => {
      console.log(resp);
    })*/
    this.sharedService.muestraConfirmacion('AceptaS??').subscribe();
    
  }
}
