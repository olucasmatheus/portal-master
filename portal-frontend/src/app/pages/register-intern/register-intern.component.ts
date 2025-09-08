import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service'; // O nosso serviço de API
import { CommonModule, Location } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-register-intern',
  templateUrl: './register-intern.component.html',
  styleUrls: ['./register-intern.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], // Importa o ReactiveFormsModule
})
export class RegisterInternComponent implements OnInit {
  registerForm!: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    // Inicializamos o formulário com os seus campos e as validações
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      startDate: ['', Validators.required],
      techStack: [''],
      bio: [''],
      company: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      alert('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    // Preparamos os dados para enviar
    const formData = {
      ...this.registerForm.value,
      // O campo techStack é uma string separada por vírgulas, transformamos num array
      techStack: this.registerForm.value.techStack
        .split(',')
        .map((item: string) => item.trim()),
    };

    this.apiService.cadastrarEstagiario(formData).subscribe({
      next: (response) => {
        alert(response.message || 'Perfil cadastrado com sucesso!');
        this.router.navigate(['/interns']); // Redireciona para a lista de estagiários
      },
      error: (err) => {
        console.error('Erro ao cadastrar estagiário:', err);
        alert(`Falha no cadastro: ${err.error.message || 'Erro desconhecido'}`);
      },
    });
  }

  goBack(): void {
    this.location.back(); // Função para voltar para a página anterior
  }
}
