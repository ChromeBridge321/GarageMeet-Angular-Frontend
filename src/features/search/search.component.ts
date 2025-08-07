import { Component, inject } from '@angular/core';
import { NavComponent } from '../../shared/components/nav/nav.component';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AutoComplete } from 'primeng/autocomplete';
import { CitiesService } from './services/cities.service';
import { CitiesREST } from './models/cities.model';
import { NgFor } from '@angular/common';
import { MechanicalService } from './services/Mechanical.service';
import { MechanicalREST } from './models/mechanicalW.model';
interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-search',
  imports: [NavComponent, ButtonModule, ReactiveFormsModule, AutoComplete, FormsModule, NgFor ],
  templateUrl: './search.component.html',
  styleUrl: 'search.component.css',
})
export class SearchComponent {
  citiesService = inject(CitiesService);
  mechanicalService = inject(MechanicalService);
  items: any[] = [];
  value: any;
  city: CitiesREST | undefined;
  mechanicals: MechanicalREST[] = [];

  search(event: AutoCompleteCompleteEvent) {
    this.citiesService.searchCitiesByName(event.query).subscribe(cities => {
      this.items = cities; //cities.map((item ) => item.city_name + ', ' + item.state_name);
    });
  }

  OnSearch(value: CitiesREST) {
    if (!value || !value.states_id || !value.cities_id) { return; }
    this.mechanicalService.getMechanicalWorkshopsByCity(value.states_id, value.cities_id).subscribe(mechanicals => {
      console.log(mechanicals);
      this.mechanicals = mechanicals;
    });
  }
}
