import { Component, OnInit } from '@angular/core';
import { GmailService } from 'src/app/Services/gmail.service';
import { Router } from '@angular/router';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { AvisosService } from 'src/app/Services/avisos.service';
import { Correo } from 'src/app/Interfaces/correo';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lista-correos',
  templateUrl: './lista-correos.component.html',
  styleUrls: ['./lista-correos.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class ListaCorreosComponent implements OnInit {

  correos: Correo[];
  columnsToDisplay: string[] = ['Emisor', 'Asunto', 'Acciones'];
  displayedColumns: string[] = ['emisor', 'titulo', 'id'];
  dataSource = new MatTableDataSource<Correo>();
  expandedElement: any | null;

  responder: boolean;//se puede quitar cuando vaya Gmail

  // Subscripciones
  recibidosSubscription: Subscription;
  mensajesSubscription: Subscription[];
 
  constructor(private gmail: GmailService, private router: Router, private servicioAvisos: AvisosService) {
    this.correos = [];
    this.mensajesSubscription = [];

    let correo1: Correo, correo2: Correo;
    /*Quitar cuando cargue los correos de Gmail*/
    correo1 = {
      id: "1",
      cuerpo: `Cuerpo del Email, Cuerpo del Email, Cuerpo del Email, Cuerpo del Email, Cuerpo del Email, Cuerpo del Email
        Cuerpo del Email, Cuerpo del Email, Cuerpo del Email, Cuerpo del Email, Cuerpo del Email, Cuerpo del Email, Cuerpo del Email,
        Cuerpo del Email, Cuerpo del Email, Cuerpo del Email, Cuerpo del Email, Cuerpo del Email, Cuerpo del Email, Cuerpo del Email`,
      emisor: 'correoEmisor1@openWebinar.inv',
      titulo: "Titulo del 1"/*,
      leido: true*/
    };
    correo2 = {
      id: "2",
      cuerpo: `Cuerpo del Email, Cuerpo del Email, Cuerpo del Email, Cuerpo del Email, Cuerpo del Email, Cuerpo del Email
        Cuerpo del Email, Cuerpo del Email, Cuerpo del Email, Cuerpo del Email, Cuerpo del Email, Cuerpo del Email, Cuer`,
      emisor: 'correoEmisor2@openWebinar.inv',
      titulo: "Titulo del 2"/*,
      leido: false*/
    };
    
    this.correos.push(correo1);
    this.correos.push(correo2); 

    this.responder = false;
  }
  
  ngOnInit() {
    this.getRecibidos();
  }

  /**
   * Este metodo sirve para navegar a la ruta configurada como mal y enviarle un correo entero como parametro
   * @param correo 
   */
  verDetalle(correo){
    this.router.navigate(['/mail', {correo: JSON.stringify(correo)}]);
  }

/**
 * Aqui hacemos llamadas para recoger los emails
 * Aqui recibimos una lista de correos
 */
  getRecibidos() {
    this.recibidosSubscription = this.gmail.getRecibidos().subscribe(
      (response) => {
        const mensajes = response['messages'];

        console.log("LISTA RECIBIDOS:", mensajes);
        mensajes.forEach(element => {
          this.getMensaje(element.id);
        });
      },
      (error) => this.error(error),
    );
  }

  /**
   * Sacamos un correo en concreto dde la lista
   * @param id 
   */
  getMensaje(id: string){
    this.mensajesSubscription.push(this.gmail.getMessage(id).subscribe(
      (correoResponse) => {
        this.dataSource.data.push(correoResponse);
        this.dataSource._updateChangeSubscription();
      },
      (error) => this.error(error)
    ));	    
  }	  

  error(error){
    this.servicioAvisos.showMenssage("Se ha producido un error", 'Error');
  }

  accionRespuestaRapida() {
    console.log("Respuesta Recibida");//este se puede quitar
    this.expandedElement = null;
  }

  ngOnDestroy(){
    if(!this.recibidosSubscription.closed){
      this.recibidosSubscription.unsubscribe();
    }
    this.mensajesSubscription.forEach(element => {
      if(!element.closed){
        element.unsubscribe();
      }
    });
  }
}
