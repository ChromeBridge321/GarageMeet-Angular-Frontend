import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ClientesService } from './clientes.service';
import { RESTClient } from '../models/clientes.model';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-clientes',
  imports: [TableModule],
  templateUrl: './clientes.component.html',
})
export class ClientesComponent implements OnInit {
  clients: RESTClient[] = [];
  clientesService = inject(ClientesService)
  authService = inject(AuthService);
  loading: boolean = true;
  mechanicarWorshopId: number = this.authService.getMechanicalWorkshopData()?.id;

  ngOnInit(): void {
    this.listarClientes();
  }


  listarClientes() {
    this.loading = true;
    this.clientesService.listar(this.mechanicarWorshopId).subscribe((data) => {
      this.clients = [data];
      this.loading = false;
    });
  }
}

