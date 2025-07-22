import { Component } from '@angular/core';
import { RESTEmployee } from '../models/empleados.model';
import { EmployeeService } from './employee.service';
import { TableModule } from 'primeng/table';
import { AuthService } from '../../../../core/services/auth.service';
import { OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { Button } from "primeng/button";
import { RouterLink } from '@angular/router';
RouterLink
@Component({
  selector: 'app-listar',
  imports: [TableModule, Button, RouterLink],
  templateUrl: './listar.component.html',
})
export class ListarComponent implements OnInit {
  employees: RESTEmployee[] = [];
  employeesService = inject(EmployeeService);
  authService = inject(AuthService);
  loading: boolean = true;
  mechanicarWorshopId: number = this.authService.getMechanicalWorkshopData()?.id;
  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.loading = true;
    this.employeesService.listar(this.mechanicarWorshopId).subscribe((data) => {
      this.employees = data;
      this.loading = false;
    });
  }
}
