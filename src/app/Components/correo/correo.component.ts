import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-correo',
  templateUrl: './correo.component.html',
  styleUrls: ['./correo.component.css']
})
export class CorreoComponent implements OnInit {

  correo: any;
  pruebaNgIf: string;
  numbersWords = ['uno', 'dos', 'tres'];

  constructor(private route: ActivatedRoute) {
    this.correo = {
      titulo: "",
      cuerpo: "",
      emisor: ""
    };
    this.pruebaNgIf= "Es visible si esVisible es true, ya que *ngIf solo evalua booleanos";
  }

  ngOnInit() {
    const datosRecibidos = this.route.snapshot.paramMap.get('correo');
    this.correo = JSON.parse(datosRecibidos);
  }

  private esVisible() {
    let visible = false;
    return visible;
  }
}
