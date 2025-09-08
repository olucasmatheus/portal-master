import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAdmin()) {
    // pergunta pro authservice se o user é admin
    return true; // Permite o acesso
  } else {
    alert('Acesso negado. Você não tem permissão para acessar esta página.');
    router.navigate(['/login']);
    return false; // Bloqueia o acesso
  }
};
