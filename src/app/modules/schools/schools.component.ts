import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { first } from 'rxjs';
import { SchoolDto } from './dtos/school.dto';
import { SchoolsService } from './services/schools.service';

@Component({
  selector: 'app-schools',
  imports: [
    MatIcon,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    MatButton,
    MatIconButton,
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
  dataSource: MatTableDataSource<SchoolDto> = new MatTableDataSource<SchoolDto>([]);

  name = '';

  ngOnInit(): void {
    this.findAllSchools();
  }

  findAllSchools(): void {
    this.schoolsService
      .findAll()
      .pipe(first())
      .subscribe((response) => {
        this.dataSource.data = response.data;
      });
  }
}
