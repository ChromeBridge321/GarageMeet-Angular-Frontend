import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CargosService } from './cargos.service';
import { RESTPositions } from '../models/cargos.model';
import { AuthService } from '../../../../core/services/auth.service';
import { Button } from "primeng/button"; '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-listar',
  imports: [TableModule, Button, RouterLink],
  templateUrl: './listar.component.html',
})
export class ListarComponent implements OnInit {
  positions: RESTPositions[] = [];
  cargosService = inject(CargosService)
  authService = inject(AuthService);
  loading: boolean = true;
  mechanicalWorkshopId: number = this.authService.getMechanicalWorkshopData()?.id;

  ngOnInit() {
    this.listar();
  }

  listar() {
    this.loading = true;
    this.cargosService.listar(this.mechanicalWorkshopId).subscribe((data) => {
      this.positions = data;
      this.loading = false;
    });
  }
}
