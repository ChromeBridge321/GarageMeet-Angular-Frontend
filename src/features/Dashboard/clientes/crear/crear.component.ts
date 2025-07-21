import { Component, inject, OnInit, OnDestroy, signal, Signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { Model } from '../vehiculos/models/vehiculo.model';
import { Make } from '../vehiculos/models/vehiculo.model';
import { VehiculosService } from '../vehiculos/vehiculos.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
@Component({
  selector: 'app-crear',
  imports: [InputTextModule, FormsModule, SelectModule, FloatLabel],
  templateUrl: './crear.component.html',
})
export class CrearComponent implements OnInit, OnDestroy {
  models = signal<Model[]>([]);
  allModels: Model[] = []; // Guardamos todos los modelos para restaurar cuando el filtro esté vacío
  makes = signal<Make[]>([]);
  allMakes: Make[] = []; // Guardamos todas las marcas para restaurar cuando el filtro esté vacío
  selectedModel: Model | undefined;
  selectedMake: Make | undefined;
  vehiclesService = inject(VehiculosService);

  private searchSubject = new Subject<string>();
  private searchModelsSubject = new Subject<string>();

  ngOnInit() {
    this.getModels();
    this.getMakes();
    this.setupSearch();
    this.setupModelsSearch();
  }

  private setupSearch(): void {
    this.searchSubject.pipe(
      debounceTime(300), // Espera 300ms después del último keystroke
      distinctUntilChanged() // Solo procesa si el valor cambió
    ).subscribe(searchTerm => {
      if (searchTerm.trim() === '') {
        // Si el filtro está vacío, muestra todas las marcas
        this.makes.set(this.allMakes);
      } else {
        // Si hay texto, busca las marcas filtradas
        this.searchMakesByName(searchTerm);
      }
    });
  }

  private setupModelsSearch(): void {
    this.searchModelsSubject.pipe(
      debounceTime(300), // Espera 300ms después del último keystroke
      distinctUntilChanged() // Solo procesa si el valor cambió
    ).subscribe(searchTerm => {
      if (searchTerm.trim() === '') {
        // Si el filtro está vacío, muestra todos los modelos
        this.models.set(this.allModels);
      } else {
        // Si hay texto, busca los modelos filtrados
        this.searchModelsByName(searchTerm);
      }
    });
  }

  getModels(): void {
    this.vehiclesService.getModels().subscribe((data) => {
      this.allModels = data; // Guardamos todos los modelos
      this.models.set(data); // Mostramos todos los modelos inicialmente
      console.log('Models:', this.models());
    });
  }

  getMakes(): void {
    this.vehiclesService.getMakes().subscribe((data) => {
      this.allMakes = data; // Guardamos todas las marcas
      this.makes.set(data); // Mostramos todas las marcas inicialmente
      console.log('Makes:', this.makes());
    });
  }

  getMakesByName(searchTerm: string): void {
    // Esta función ahora maneja el filtro de PrimeNG para marcas
    console.log('Filter term (makes):', searchTerm); // Para debug
    this.searchSubject.next(searchTerm || '');
  }

  getModelsByName(searchTerm: string): void {
    // Esta función maneja el filtro de PrimeNG para modelos
    console.log('Filter term (models):', searchTerm); // Para debug
    this.searchModelsSubject.next(searchTerm || '');
  }

  private searchMakesByName(name: string): void {
    // Esta es la función que hace la llamada real al servicio para marcas
    this.vehiclesService.getMakesByName(name).subscribe((data) => {
      this.makes.set(data);
      console.log('MakesFilter:', this.makes());
    });
  }

  private searchModelsByName(name: string): void {
    // Esta es la función que hace la llamada real al servicio para modelos
    this.vehiclesService.getModelsByName(name).subscribe((data) => {
      this.models.set(data);
      console.log('ModelsFilter:', this.models());
    });
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
    this.searchModelsSubject.complete();
  }
}
