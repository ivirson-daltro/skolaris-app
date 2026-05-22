import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { STATES } from '../../../../common/constants/states';

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
  ],
  templateUrl: './create-school.component.html',
  styleUrl: './create-school.component.scss',
})
export class CreateSchoolComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

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

  submit() {
    console.log(this.form.value);
  }
}
