import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, IonModal, ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components'
import { elemento } from '../interfaces/elemento-interface';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage{

  segment;
  data = '';
  cuartos = [];
  cuarto = '';
  listaElementos: elemento[] = [];
 
  todo = { id: 0, nombre: '', posicion : {}, tipo_elemento: '', opcion: '', estado: '', segment: ''};
  selectedQuadrant: string = '';
  opcionElemento: string = '';
  resultado: any;

  @ViewChild(IonModal) modal: IonModal;
  @ViewChild('openModal') openModal!: ModalController;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name: string;

  constructor(
              public actionSheetController: ActionSheetController,
              private localStorageService: LocalStorageService)
    {

    if(this.localStorageService.get('cuartos') !== null) {
      this.cuartos = this.localStorageService.get('cuartos');
    }
    if( this.localStorageService.get('lista_elementos') !== null ) {
      this.listaElementos = this.localStorageService.get('lista_elementos');

      
    }

  }

  addTodo() {
    if(this.cuarto == '') {
      this.todo.id = this.listaElementos.length;
      this.todo.tipo_elemento = this.selectedQuadrant;
      this.todo.opcion = this.opcionElemento;
      this.todo.posicion = {x: 0, y: 0}
      this.todo.segment = this.segment;
      if(this.todo.tipo_elemento=="mesa") {
        this.todo.estado = "vacia";
      }
      this.listaElementos.push(this.todo);
      this.localStorageService.set('lista_elementos', this.listaElementos)
      this.todo = { id: 0,nombre: '',  posicion: {}, tipo_elemento: '', opcion: '', estado: '', segment: ''};
      this.modal.dismiss(this.name, 'confirm');
    } else {
      this.cuartos.push(this.cuarto);
      this.enviarCuartoALocalStorage();
      this.openModal.dismiss();
    }
    
    this.cuarto = '';
    
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
    this.openModal.dismiss();
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
    this.openModal.dismiss();
  }

  addCuarto(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'open-modal-add-cuartos') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  eliminarCuarto(){
    let indice = this.cuartos.indexOf(this.segment);
    this.cuartos.splice(indice, 1);
    this.enviarCuartoALocalStorage();
  }

  enviarCuartoALocalStorage() {
    this.localStorageService.set('cuartos', this.cuartos);
  }

  enviarElementosALocalStorage() {
    this.localStorageService.set('lista_elementos', this.listaElementos);
  }

  async presentActionSheet(elemento) {
    if(elemento.tipo_elemento=="mesa"){
      const actionSheet = await this.actionSheetController.create({
        header: 'Estado actual: ' + elemento.estado,
        cssClass: 'my-custom-class',
        buttons: [
            {
              text: 'Vacia',
              icon: 'share',
              data: 10,
              handler: () => {
                document.getElementById(elemento.id).style.border = '4px solid green';
                this.cambiarEstadoMesa('vacia', elemento);
              }
            }
          , {
          text: 'Orden Asignada',
          icon: 'clipboard',
          data: 'Data value',
          handler: () => {
            document.getElementById(elemento.id).style.border = '4px solid red';
            this.cambiarEstadoMesa('asignada', elemento);
          }
        }, {
          text: 'Despachada',
          icon: 'checkbox',
          handler: () => {
            document.getElementById(elemento.id).style.border = '4px solid yellow';
            this.cambiarEstadoMesa('despachada', elemento);
          }
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          icon: 'trash',
          id: 'delete-button',
          data: {
            type: 'delete'
          },
          handler: () => {
            let incremento = 0;
            let indice: any;
            indice = this.listaElementos.map(function(item){
              if(item.id == elemento.id){
                
                return incremento;
              }
              incremento ++;
            });
            if(indice[0] !== ''){
              this.listaElementos.splice(indice[0], 1);
              this.enviarElementosALocalStorage();
            }
          }
        }
      ]
      });
      await actionSheet.present();
    } else if(elemento.tipo_elemento=="pared") {
      const actionSheet = await this.actionSheetController.create({
        header: 'Eliminar pared',
        cssClass: 'my-custom-class',
     
        buttons: [
          {
            text: 'Eliminar',
            role: 'destructive',
            icon: 'trash',
            id: 'delete-button',
            data: {
              type: 'delete'
            },
            handler: () => {
              let incremento = 0;
              let indice: any;
               indice = this.buscarItem(elemento); 
              if(indice !== undefined){
                this.listaElementos.splice(indice[0], 1);
                this.enviarElementosALocalStorage();
              }
            }
          }
      ]
      });
      await actionSheet.present();
    }
  }

  buscarItem(elemento){
    let incremento:number = 0;
    let indiceElementoEncontrado:number = 0; 
    this.listaElementos.map(function(item){
      if(item.id == elemento.id){
        
        indiceElementoEncontrado = incremento;
      }
      incremento ++;
    });

    return indiceElementoEncontrado;
  }

  cambioDeCuarto(e) {
    console.log(e.detail.value);
  }

  onDragEnded(event, item) {
    let element = event.source.getRootElement();
    let boundingClientRect = element.getBoundingClientRect();
    let parentPosition = this.getPosition
    
    (element);
    console.log('x: ' + (boundingClientRect.x - parentPosition.left), 'y: ' + (boundingClientRect.y - parentPosition.top));
    this.listaElementos.map(function(elemento){
      if(elemento.id == item.id){
        elemento.posicion = {x: boundingClientRect.x - parentPosition.left, y: boundingClientRect.y - parentPosition.top};
      }
    });
    this.enviarElementosALocalStorage();
    
  }
  
  getPosition(el) {
    let x = 0;
    let y = 0;
    while(el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      x += el.offsetLeft - el.scrollLeft;
      y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return { top: y, left: x };
  }

  cambiarEstadoMesa(estado, item) {
    this.listaElementos.map(function(elemento){
      if(elemento.id == item.id){
        elemento.estado = estado;
      }
    });
    this.enviarElementosALocalStorage();
  }

}
