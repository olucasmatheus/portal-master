import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService, Estagiario } from './services/api.service';
import { NgIf, NgFor } from '@angular/common'; //mostrar os dados no HTML
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor() {
    console.log('teste de componente - inicialização');
  }
}
