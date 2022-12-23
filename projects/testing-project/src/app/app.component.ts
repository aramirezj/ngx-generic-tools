import { Component, ViewChild } from '@angular/core';
import { GTForm, GT_TC } from 'ngx-generic-tools/models';
import { GT_TF } from 'projects/ngx-generic-tools/models/public-api';
import { Dialog } from '@angular/cdk/dialog';
import { GTTableComponent } from 'ngx-generic-tools/tables';
import { FormControl, FormGroup } from '@angular/forms';
import { GTFormService } from 'projects/ngx-generic-tools/forms/form.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sample-project';

  miForm: GTForm = new GTForm(GT_TF.CREATION, ['nombre', 'fecha'], ['Nombre', 'Fecha'], 'Creación');
  @ViewChild(GTTableComponent) table:GTTableComponent

  datos:any[] = [{nombre:'xd',apellidos:'omgggg'},{nombre:'xdawdd',apellidos:'omgggggg'},{nombre:'xddd',apellidos:'om  gggg'},{nombre:'ddxd',apellidos:'omgggg'}];
  modelo:string[] =  ['nombre','apellidos'];
  visual:string[] =  ['Nombre','Apellidos'];

  formC:FormGroup = new FormGroup({campo:new FormControl({value:null,disabled:false})})
  constructor(private formService: GTFormService,public ckDialog: Dialog) {

  }
  ngOnInit() {
    this.miForm.changeType(GT_TC.FECHA,['fecha']);
    this.formService.showForm(this.miForm).subscribe(resp => {
      console.log(resp);
    })
    //this.sharedService.muestraConfirmacion('¿Aceptas todos los cargos que se te inputan?').subscribe();
    
  }
}
