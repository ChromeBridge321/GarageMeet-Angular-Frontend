import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';

import { MessageService, ConfirmationService } from 'primeng/api';

// Models y Services
import { Piece, CreatePiece, UpdatePiece } from '../models/pieces.model';
import { PiecesService } from '../services/pieces.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-pieces',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    InputNumberModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {
  pieces: Piece[] = [];
  loading = false;
  mechanicalWorkshopId: number;

  // Modal variables
  showModal = false;
  isEditing = false;
  modalTitle = '';

  // Form data
  pieceForm: Partial<CreatePiece & UpdatePiece> = {
    name: '',
    price: 0
  };

  constructor(
    private piecesService: PiecesService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
    this.mechanicalWorkshopId = this.authService.getMechanicalWorkshopData()?.id;
  }

  ngOnInit() {
    this.loadPieces();
  }

  loadPieces() {
    if (!this.mechanicalWorkshopId) {
      console.error('mechanical_workshop_id no está disponible');
      return;
    }

    this.loading = true;
    this.piecesService.load(this.mechanicalWorkshopId).subscribe({
      next: (data) => {
        this.pieces = data;
        this.loading = false;
        console.log('Piezas cargadas:', data);
      },
      error: (error) => {
        console.error('Error al cargar piezas:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las piezas'
        });
        this.loading = false;
      }
    });
  }

  openCreateModal() {
    this.isEditing = false;
    this.modalTitle = 'Crear Nueva Pieza';
    this.pieceForm = {
      name: '',
      price: 0
    };
    this.showModal = true;
  }

  openEditModal(piece: Piece) {
    this.isEditing = true;
    this.modalTitle = 'Editar Pieza';
    this.pieceForm = {
      pieces_id: piece.pieces_id,
      name: piece.name,
      price: piece.price
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.pieceForm = {
      name: '',
      price: 0
    };
  }

  savePiece() {
    if (!this.mechanicalWorkshopId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'ID del taller no disponible'
      });
      return;
    }

    if (!this.pieceForm.name || !this.pieceForm.price) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor, completa todos los campos obligatorios'
      });
      return;
    }

    if (this.isEditing && this.pieceForm.pieces_id) {
      // Actualizar pieza existente
      const updateData = {
        name: this.pieceForm.name,
        price: this.pieceForm.price
      };

      this.piecesService.update(this.pieceForm.pieces_id, updateData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Pieza actualizada correctamente'
          });
          this.loadPieces();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar pieza:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar la pieza'
          });
        }
      });
    } else {
      // Crear nueva pieza
      const createData = {
        name: this.pieceForm.name,
        price: this.pieceForm.price
      };

      this.piecesService.create(createData, this.mechanicalWorkshopId).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Pieza creada correctamente'
          });
          this.loadPieces();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear pieza:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear la pieza'
          });
        }
      });
    }
  }

  deletePiece(piece: Piece) {
    if (!this.mechanicalWorkshopId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'ID del taller no disponible'
      });
      return;
    }

    this.confirmationService.confirm({
      message: `¿Estás seguro de que quieres eliminar la pieza "${piece.name}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.piecesService.delete(piece.pieces_id, this.mechanicalWorkshopId!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Pieza eliminada correctamente'
            });
            this.loadPieces();
          },
          error: (error) => {
            console.error('Error al eliminar pieza:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar la pieza'
            });
          }
        });
      }
    });
  }

  limpiarFiltros(table: any) {
    table.clear();
    // Limpiar también los inputs de filtro por columna
    const filterInputs = document.querySelectorAll('input[pInputText]');
    filterInputs.forEach((input: any) => {
      input.value = '';
    });
  }
}
