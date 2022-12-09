import { Component, Input } from '@angular/core';
//import { hehe2 } from 'ngx-generic-tools'
@Component({
  selector: 'my-table',
  templateUrl: './table.component.html',
})
export class TableComponent {
 // hola: hehe2
  @Input() public rowData: Array<{ make: string, model: string, price: number }> = [];
  ngOnInit(){
 //   this.hola = {name:'xdd'};
    //this.hola.name = 'xd';
  //  alert(this.hola)
  }

}
