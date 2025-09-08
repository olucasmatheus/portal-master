import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; //ele usa o ngif e ngfor no html
import { ApiService, Estagiario } from '../../services/api.service'; //comunicação com a api
import { AuthService } from '../../services/auth.service'; //para verificar se é admin
@Component({
  selector: 'app-interns',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './interns.component.html',
  styleUrl: './interns.component.scss',
})
export class InternsComponent implements OnInit {
  public estagiarios: Estagiario[] = []; //vetor para guardar os estagiários

  constructor(
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadInterns();
  }

  loadInterns(): void {
    this.apiService.getEstagiarios().subscribe({
      next: (data: any) => {
        this.estagiarios = data.estagiarios;
        console.log('Dados dos estagiários carregados:', this.estagiarios);
      },
      error: (err) => {
        console.error('Falha ao buscar os dados dos estagiários', err);
      },
    });
  }

  irHome() {
    this.router.navigate(['/home']);
  }

  irLogin() {
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  goToRegisterPage(): void {
    this.router.navigate(['/register-intern']);
  }

  editStory(estagiario: Estagiario): void {
    const newStory = prompt('Digite o novo depoimento:', estagiario.story || '');

    if(newStory !== null){ //impede que o usuario clique em cancelar ate editar
      const internId = (estagiario as any)._id || estagiario.id;

      this.apiService.updateStory(internId, newStory).subscribe({
        next: () => {
          alert('Depoimento atualizado');
          this.loadInterns(); //recarrega a lista 
        },
        error: (err) => {
          console.error('Erro ao editar o depoimento', err);
          alert(`Falha ao atualizar: ${err.error.message || 'Erro'}`)
        }
      })
    }
  }

  deleteStory(estagiario: Estagiario): void {
    if (confirm(`Tem certeza que deseja deletar o depoimento de ${estagiario.name}?`)) {
      const internId = (estagiario as any)._id || estagiario.id;

      this.apiService.deleteStory(internId).subscribe({
        next: () => {
          alert('Depoimento deletado com sucesso!');
          this.loadInterns(); // recarrega a lista
        },
        error: (err) => {
          console.error('Erro ao deletar depoimento', err);
          alert(`Falha ao deletar: ${err.error.message || 'Erro'}`);
        }
      });
    }
  }
}
