import { Dialog } from "@angular/cdk/dialog";
import { Injectable } from "@angular/core";
import { GTFormulario } from "ngx-generic-tools/models";
import { GTEditarGenericoComponent } from "./../forms/editar-generico/editar-generico.component";

@Injectable()
export class GTFormService {
    constructor(
        private dialog:Dialog
    ) {

    }

    showForm(form: GTFormulario) {
        const dialogRef = this.dialog.open(GTEditarGenericoComponent, {data:form,minWidth:'35vw'})
        return dialogRef.closed;
    }
}