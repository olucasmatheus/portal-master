import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-login',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginData = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService,private router: Router) { }


  onLogin(){
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        console.log('login funcionou', response);
        this.router.navigate(['/home']); //redireciona para a pagina home
      },
      error: (err) => {
        console.error('Ocorreu um erro no login', err);
      }
    })
  }
  irHome() {
    this.router.navigate(['/home']);
  }

  irInterns() {
    this.router.navigate(['/interns']);
  }

  irRegister() {
    this.router.navigate(['/register']);
  }
}
