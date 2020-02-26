import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-nuevo-correo',
  templateUrl: './nuevo-correo.component.html',
  styleUrls: ['./nuevo-correo.component.css']
})
export class NuevoCorreoComponent implements OnInit {

  nuevoCorreo: FormGroup;
  submitted = false;
  @Input() correo: any;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.nuevoCorreo = this.formBuilder.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      cuerpo: ['', [Validators.required, Validators.minLength(10)]],
      destinatario: ['', [Validators.required, Validators.email]],
    });
    //console.log(this.correo);

    if(this.correo != undefined){
      console.log("A",this.correo);
      /*paso de informacion a los input del formulario, es como enviar los 
        parametros por url cuando pinchas 'Responder' pero por post
      */
      this.nuevoCorreo.patchValue({
        titulo: 'Re: '+ this.correo.titulo, 
        destinatario: this.correo.emisor
      }); 
    }
  }

  get formulario() { return this.nuevoCorreo.controls; }

  onSubmit() {
      this.submitted = true;

      if (this.nuevoCorreo.invalid) {
          return;
      }

      let correo = this.nuevoCorreo.value;
      correo.leido= false;
      correo.emisor= 'correoEmisor1@openWebinar.inv';

      alert("Correo Enviado \nEliminamos el formulario");
      this.onReset();
  }

  onReset() {
      this.submitted = false;
      this.nuevoCorreo.reset();
  }
}