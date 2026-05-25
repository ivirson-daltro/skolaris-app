import { inject, Injectable } from '@angular/core';
import { CreateSchoolResponseDto } from '../dtos/create-school-response.dto';
import { Observable } from 'rxjs';
import { CreateSchoolRequestDto } from '../dtos/create-school-request.dto';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PaginatedResponseDto } from '../../../common/dtos/paginated-response.dto';
import { SchoolDto } from '../dtos/school.dto';

@Injectable({
  providedIn: 'root',
})
export class SchoolsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  findAll(): Observable<PaginatedResponseDto<SchoolDto>> {
    return this.http.get<PaginatedResponseDto<SchoolDto>>(`${this.apiUrl}/tenants`);
  }

  createSchool(school: CreateSchoolRequestDto): Observable<CreateSchoolResponseDto> {
    return this.http.post<CreateSchoolResponseDto>(`${this.apiUrl}/tenants`, school);
  }
}
