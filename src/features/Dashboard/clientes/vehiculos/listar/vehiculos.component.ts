import { Component } from '@angular/core';
import { OnInit, inject } from '@angular/core';
import { RESTClient } from '../../models/clientes.model';
import { ClientesService } from '../../services/clientes.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { TableModule } from 'primeng/table';
import { Button } from "primeng/button";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-vehiculos',
  imports: [TableModule, Button, RouterLink ],
  templateUrl: './vehiculos.component.html',
})
export class VehiculosComponent implements OnInit {
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
    this.clientesService.load(this.mechanicarWorshopId).subscribe((data) => {
      this.clients = data;
      this.loading = false;
    });
  }
}
