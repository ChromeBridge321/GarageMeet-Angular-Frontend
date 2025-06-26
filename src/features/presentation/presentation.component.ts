import { Component } from '@angular/core';
import { NavComponent } from '../../shared/components/nav/nav.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-presentation',
  imports: [NavComponent, FooterComponent],
  templateUrl: './presentation.component.html',
})
export class PresentationComponent { }
