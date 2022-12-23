import { Dialog } from "@angular/cdk/dialog";
import { Injectable } from "@angular/core";
import { GTForm } from "ngx-generic-tools/models";
import { GTGenericEditorComponent } from "./../forms/editar-generico/editar-generico.component";

@Injectable({providedIn:'root'})
export class GTFormService {
    constructor(
        private dialog:Dialog
    ) {

    }

    showForm(form: GTForm) {
        const dialogRef = this.dialog.open(GTGenericEditorComponent, {data:form,minWidth:'35vw'})
        return dialogRef.closed;
    }
}