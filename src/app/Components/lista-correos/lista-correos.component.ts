import { Component, OnInit } from '@angular/core';
import { GmailService } from 'src/app/Services/gmail.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-correos',
  templateUrl: './lista-correos.component.html',
  styleUrls: ['./lista-correos.component.css']
})
export class ListaCorreosComponent implements OnInit {

  correos: any[];
  responder: boolean;
  correoAResponder: any;

  constructor(private gmail: GmailService, private router: Router) {
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
  verDetalle(correo){
    this.router.navigate(['/mail', {correo: JSON.stringify(correo)}]);
  }
  ngOnInit() {
    this.getRecibidos();
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
        this.correos.push(mensage);
      },
      (error) => this.error(error)
    );	    
  }	  

  error(error){
    console.warn("ERROR");
  }

  clickResponder(correo) {
    /* this.responder = !this.responder;
    this.correoAResponder = correo; */
    correo.responder = !correo.responder;
  }

  accionRespuestaRapida(correo) {
    console.log("Respuesta Recibida");//este se puede quitar
    correo.responder = false;
  }

}
