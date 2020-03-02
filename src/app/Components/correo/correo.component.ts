import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Correo } from 'src/app/Interfaces/correo';

@Component({
  selector: 'app-correo',
  templateUrl: './correo.component.html',
  styleUrls: ['./correo.component.scss']
})
export class CorreoComponent implements OnInit {

  correo: Correo;
  pruebaNgIf: string;
  numbersWords = ['uno', 'dos', 'tres'];

  constructor(private route: ActivatedRoute) {
    this.correo = {
      id: "",
      titulo: "",
      cuerpo: "",
      emisor: ""/*,
      leido: false*/
    };
    this.pruebaNgIf= "Es visible si esVisible es true, ya que *ngIf solo evalua booleanos";
  }

  ngOnInit() {
    const datosRecibidos = this.route.snapshot.paramMap.get('correo');
    if(datosRecibidos){
      this.correo = JSON.parse(datosRecibidos);
    }
  }

  private esVisible() {
    let visible = false;
    return visible;
  }
}
