import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-correo',
  templateUrl: './correo.component.html',
  styleUrls: ['./correo.component.css']
})
export class CorreoComponent implements OnInit {

  correo: any;
  pruebaNgIf: string;
  numbersWords = ['uno', 'dos', 'tres'];

  constructor() {
    this.correo = {
      titulo: "Titulo del email",
      cuerpo: "Cuerpazo del email",
      emisor: "emisor@gmail.com",
      destinatario: "receptor@gmail.com"
    };
    this.pruebaNgIf= "Es visible si esVisible es true, ya que *ngIf solo evalua booleanos";
  }

  ngOnInit() {
  }

  private esVisible() {
    let visible = false;
    return visible;
  }
}
