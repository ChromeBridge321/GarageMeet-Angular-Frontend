import { Injectable, signal } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { VehiculosService } from '../vehiculos/vehiculos.service';
import { Make, Model } from '../vehiculos/models/vehiculo.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleSearchService {
  private readonly SEARCH_DEBOUNCE_TIME = 300;

  // Signals
  models = signal<Model[]>([]);
  makes = signal<Make[]>([]);

  // Data storage
  allModels: Model[] = [];
  allMakes: Make[] = [];

  // Search subjects
  private readonly searchSubject = new Subject<string>();
  private readonly searchModelsSubject = new Subject<string>();

  constructor(private readonly vehiclesService: VehiculosService) {
    this.setupSearchStreams();
  }

  initializeData(): void {
    this.loadModels();
    this.loadMakes();
  }

  searchMakes(searchTerm: string): void {
    this.searchSubject.next(searchTerm || '');
  }

  searchModels(searchTerm: string): void {
    this.searchModelsSubject.next(searchTerm || '');
  }

  resetToAllData(): void {
    this.models.set(this.allModels);
    this.makes.set(this.allMakes);
  }

  destroy(): void {
    this.searchSubject.complete();
    this.searchModelsSubject.complete();
  }

  private loadModels(): void {
    this.vehiclesService.getModels().subscribe((data) => {
      this.allModels = data;
      this.models.set(data);
    });
  }

  private loadMakes(): void {
    this.vehiclesService.getMakes().subscribe((data) => {
      this.allMakes = data;
      this.makes.set(data);
    });
  }

  private setupSearchStreams(): void {
    this.searchSubject.pipe(
      debounceTime(this.SEARCH_DEBOUNCE_TIME),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      if (searchTerm.trim() === '') {
        this.makes.set(this.allMakes);
      } else {
        this.searchMakesByName(searchTerm);
      }
    });

    this.searchModelsSubject.pipe(
      debounceTime(this.SEARCH_DEBOUNCE_TIME),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      if (searchTerm.trim() === '') {
        this.models.set(this.allModels);
      } else {
        this.searchModelsByName(searchTerm);
      }
    });
  }

  private searchMakesByName(name: string): void {
    this.vehiclesService.getMakesByName(name).subscribe((data) => {
      this.makes.set(data);
    });
  }

  private searchModelsByName(name: string): void {
    this.vehiclesService.getModelsByName(name).subscribe((data) => {
      this.models.set(data);
    });
  }
}
