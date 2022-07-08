import { Component, ViewChild } from '@angular/core';
import { ActionSheetController, IonModal, ToastController } from '@ionic/angular';
import { DragulaService } from 'ng2-dragula';
import { OverlayEventDetail } from '@ionic/core/components'
import { elemento, elementoParaAdicionar } from '../interfaces/elemento-interface';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  Arr = Array;
  num:number = 12;

  listaElementos: elemento[] = [];

  listElementosParaAdicionar: elementoParaAdicionar[] = [];
 
  todo = { value: '',  tipo_elemento: '', opcion: '', estado: ''};
  selectedQuadrant: string = '';
  opcionElemento: string = '';
  resultado: any;

  @ViewChild(IonModal) modal: IonModal;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name: string;
 
  constructor(private dragulaService: DragulaService, 
              private toastController: ToastController,
              public actionSheetController: ActionSheetController) {
 
    this.dragulaService.removeModel('bag')
    .subscribe(({ item }) => {
      this.toastController.create({
        message: 'Removed: ' + item.value,
        duration: 2000
      }).then(toast => toast.present());
    });
 
    this.dragulaService.dropModel('bag')
      .subscribe(({ item }) => {
        item['color'] = 'success';
      });

      this.dragulaService.createGroup('bag', {
        removeOnSpill: true
      });

    this.dragulaService.drop('bag')
    .subscribe(({ name, el, target, source, sibling }) => {
      console.log(el.id, target.id, el.classList[0])
      this.resultado = this.listElementosParaAdicionar.find( elemento => elemento.value == el.id);
      this.listaElementos.push({id: el.id, id_posicion: target.id, tipo_elemento: this.resultado.tipo_elemento, opcion: el.classList[0], estado: this.resultado.estado})
      this.resultado = "";
    });
  }
 
  addTodo() {

    this.todo.tipo_elemento = this.selectedQuadrant;
    this.todo.opcion = this.opcionElemento;
    if(this.todo.tipo_elemento=="mesa") {
      this.todo.estado = "vacia";
    }
    this.listElementosParaAdicionar.push(this.todo);
    this.todo = { tipo_elemento: '', value: '', opcion: '', estado: ''};
    this.modal.dismiss(this.name, 'confirm');
    
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  updateSearch(posicion) {
    let resultado = this.listaElementos.find( elemento => elemento.id == posicion);
    if(resultado.tipo_elemento=="mesa"){
      this.presentActionSheet(resultado);
    }
    console.log("prueba " + posicion);
    
  }

  async presentActionSheet(elemento) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Estado actual: ' + elemento.estado,
      cssClass: 'my-custom-class',
   
      buttons: [
          {
            text: 'Vacia',
            icon: 'share',
            data: 10,
            handler: () => {
              console.log('Share clicked');
            }
          }

        , {
        text: 'Orden Asignada',
        icon: 'clipboard',
        data: 'Data value',
        handler: () => {
          console.log('Play clicked');
        }
      }, {
        text: 'Despachada',
        icon: 'checkbox',
        handler: () => {
          console.log('Favorite clicked');
        }
      },
    ]
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role and data', role, data);
    
  }

}
