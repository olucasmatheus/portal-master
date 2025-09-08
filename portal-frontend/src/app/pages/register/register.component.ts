import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../../services/auth.service'; //autenticação

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule], 
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  // Objeto que vai guardar os dados do formulário
  registerData = {
    name: '',
    email: '',
    password: ''
  };

  constructor(private authService: AuthService,private router: Router) {}

  // evento é ativado quando clicamos no botao
  onRegister(): void {
    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        console.log('Cadastro realizado', response);
        this.router.navigate(['/login']); // redireciona para a página de login após o cadastro
      },
      error: (err) => {
        console.error('Fala no cadastro', err);
      }
    })
  }

  irParaLogin(): void{
    this.router.navigate(['/login']); // redireciona para a página de login
  }
}