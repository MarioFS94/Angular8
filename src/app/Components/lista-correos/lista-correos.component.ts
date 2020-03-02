import { Component, OnInit } from '@angular/core';
import { GmailService } from 'src/app/Services/gmail.service';
import { Router } from '@angular/router';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { AvisosService } from 'src/app/Services/avisos.service';

@Component({
  selector: 'app-lista-correos',
  templateUrl: './lista-correos.component.html',
  styleUrls: ['./lista-correos.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class ListaCorreosComponent implements OnInit {

  correos: any[];
  columnsToDisplay: string[] = ['Emisor', 'Asunto', 'Acciones'];
  displayedColumns: string[] = ['emisor', 'titulo', 'id'];
  dataSource = new MatTableDataSource<any>();
  expandedElement: any | null;

  responder: boolean;//se puede quitar cuando vaya Gmail

  constructor(private gmail: GmailService, private router: Router, private servicioAvisos: AvisosService) {
    this.correos = [];
    /*Quitar cuando cargue los correos de Gmail */
    const correo1 = {
      titulo: "Titulo del 1",
      cuerpo: `Cuerpo del Email, Cuerpo del Email, Cuerpo del Email, Cuerpo del Email, Cuerpo del Email, Cuerpo del Email
        Cuerpo del Email, Cuerpo del Email, Cuerpo del Email, Cuerpo del Email, Cuerpo del Email, Cuerpo del Email, Cuerpo del Email,
        Cuerpo del Email, Cuerpo del Email, Cuerpo del Email, Cuerpo del Email, Cuerpo del Email, Cuerpo del Email, Cuerpo del Email`,
      emisor: 'correoEmisor1@openWebinar.inv',
      destinatario: 'correoReceptor@openWebinar.inv',
      leido: true
    };
    const correo2 = {
      titulo: "Titulo del 2",
      cuerpo: `Cuerpo del Email, Cuerpo del Email, Cuerpo del Email, Cuerpo del Email, Cuerpo del Email, Cuerpo del Email
        Cuerpo del Email, Cuerpo del Email, Cuerpo del Email, Cuerpo del Email, Cuerpo del Email, Cuerpo del Email, Cuer`,
      emisor: 'correoEmisor2@openWebinar.inv',
      destinatario: 'correoReceptor@openWebinar.inv',
      leido: false
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

  getRecibidos() {
    this.gmail.getRecibidos().subscribe(
      (response) => {
        const mensajes = response.messages;
        console.log("LISTA RECIBIDOS:", mensajes);
        mensajes.forEach(element => {
          this.getMensaje(element.id);
        });
      },
      (error) => this.error(error),
    );
  }

  getMensaje(id: string){
    this.gmail.getMessage(id).subscribe(
      (response) => {
        const emisor = response.payload.headers.find(e => e.name === "From");
        const subject = response.payload.headers.find(e => e.name === "Subject");

        const mensage = {
          id: response.id,
          cuerpo: response.snippet,
          emisor: emisor? emisor.value : undefined,
          titulo: subject? subject.value : undefined,
        };
        this.dataSource.data.push(mensage);
        this.dataSource._updateChangeSubscription();
      },
      (error) => this.error(error)
    );	    
  }	  

  error(error){
    this.servicioAvisos.showMenssage("Se ha producido un error", 'Error');
  }

  accionRespuestaRapida() {
    console.log("Respuesta Recibida");//este se puede quitar
    this.expandedElement = null;
  }

}
