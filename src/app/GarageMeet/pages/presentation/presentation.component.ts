import { Component } from '@angular/core';
import { NavComponent } from "../../components/nav/nav.component";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-presentation',
  imports: [NavComponent, FooterComponent],
  templateUrl: './presentation.component.html',
})
export class PresentationComponent { }
