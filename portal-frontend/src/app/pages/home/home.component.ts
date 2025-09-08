import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  nomeUsuario: string = 'Estagiário novo(a)';
  dataAtual: Date = new Date(); // Pega a data atual 
  constructor(private router: Router) { }

  irInterns() {
    this.router.navigate(['/interns']);
  }

  irLogin() {
    this.router.navigate(['/login']);
  }
}
