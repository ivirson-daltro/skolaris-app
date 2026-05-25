import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAnchor } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { first, tap } from 'rxjs';
import { STATES } from '../../../../common/constants/states';
import { ToastService } from '../../../../shared/services/toast.service';
import { CreateSchoolRequestDto } from '../../dtos/create-school-request.dto';
import { SchoolsService } from '../../services/schools.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-school',
  imports: [
    RouterLink,
    MatIcon,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatSelect,
    MatOption,
    MatError,
    MatAnchor,
  ],
  templateUrl: './create-school.component.html',
  styleUrl: './create-school.component.scss',
})
export class CreateSchoolComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly schoolsService = inject(SchoolsService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  form!: FormGroup;

  states = STATES;

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.nonNullable.group({
      name: ['', Validators.required],
      cnpj: [''],
      phone: [''],
      plan: ['free', Validators.required],
      address: this.fb.nonNullable.group({
        zipCode: [''],
        street: [''],
        number: [''],
        complement: [''],
        neighborhood: [''],
        city: [''],
        state: [''],
      }),
      admin: this.fb.nonNullable.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
      }),
    });
  }

  get address() {
    return this.form.controls['address'] as FormGroup;
  }

  get admin() {
    return this.form.controls['admin'] as FormGroup;
  }

  cancel(): void {
    this.router.navigate(['/schools']);
  }

  submit(): void {
    const payload: CreateSchoolRequestDto = this.buildSchoolData();
    this.schoolsService
      .createSchool(payload)
      .pipe(
        first(),
        tap(() => {
          this.toastService.success('Escola criada com sucesso!');
        }),
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/schools']);
        },
        error: (error: HttpErrorResponse) => {
          this.toastService.error(error.error?.message || 'Erro ao criar escola!');
        },
      });
  }

  private buildSchoolData(): CreateSchoolRequestDto {
    const formValue = this.form.value;
    // TODO: Adicionar Demais campos do cadastro
    return {
      name: formValue.name,
      plan: formValue.plan,
      email: formValue.admin.email,
      adminName: formValue.admin.name,
    };
  }
}
