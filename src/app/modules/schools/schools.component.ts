import { Component, inject, OnInit } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { first } from 'rxjs';
import { SchoolDto } from './dtos/school.dto';
import { SchoolsService } from './services/schools.service';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import {
  MatTable,
  MatHeaderCellDef,
  MatCellDef,
  MatHeaderRowDef,
  MatRowDef,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-schools',
  imports: [
    MatIcon,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    MatButton,
    MatTableModule,
    MatPaginator,
    DatePipe,
    RouterLink,
  ],
  templateUrl: './schools.component.html',
  styleUrl: './schools.component.scss',
})
export class SchoolsComponent implements OnInit {
  private readonly schoolsService = inject(SchoolsService);

  displayedColumns: string[] = ['name', 'plan', 'createdAt', 'actions'];
  dataSource!: MatTableDataSource<SchoolDto>;

  name = '';

  ngOnInit(): void {
    this.findAllSchools();
  }

  findAllSchools(): void {
    this.schoolsService
      .findAll()
      .pipe(first())
      .subscribe((response) => {
        this.dataSource = new MatTableDataSource(response.data);
      });
  }
}
