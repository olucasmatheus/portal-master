import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface authTokenPayload {
  userId: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private router: Router) {}

  //rota de login
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/login`, credentials).pipe(
      tap((response: any) => {
        // se a resposta tiver um token ele armazena no localStorage do navegador
        if (response && response.token) {
          localStorage.setItem('auth_token', response.token);
        }
      })
    );
  }

  //rota de cadastro
  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/createUser`, userData);
  }

  //pega o token do localStorage
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  //verifica se o usuário ta autenticado
  isAuthenticated(): boolean {
    return !!this.getToken(); //retorna true se o token existir, false se não existir
  }

  storageToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  logoutToken(): void {
    localStorage.removeItem('auth_token'); //remove o token do localStorage
    this.router.navigate(['/login']); //redireciona para a página de login
  }

  isLogged(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: authTokenPayload = jwtDecode(token);
        return decodedToken.role;
      } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        return null; // Retorna null se houver um erro ao decodificar o token
      }
    }
    return null; // Retorna null se não houver token
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin'; //verifica se o papel do usuário é admin
  }
}
