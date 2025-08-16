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
  // URL para descargar la aplicación de escritorio
  public readonly desktopDownloadUrl = 'https://github.com/ChromeBridge321/GarageMeet-Angular-Frontend/releases/download/v1.0.0/GarageMeet-Desktop-v1.0.0.zip';
}
