import { Component } from '@angular/core';
import { NavComponent } from '../../../shared/components/nav/nav.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { RouterLink } from '@angular/router';
import { environment } from '../../../eviroments/environment.dev';

@Component({
  selector: 'app-presentation',
  imports: [NavComponent, FooterComponent, RouterLink],
  templateUrl: './presentation.component.html',
})
export class PresentationComponent {
  // URL del backend para descargar el APK (desde environment)
  public readonly downloadUrl = environment.downloadUrl;
}
