import { Component, inject } from '@angular/core';
import { NavComponent } from '../../../shared/components/nav/nav.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-presentation',
  imports: [NavComponent, FooterComponent, RouterLink],
  templateUrl: './presentation.component.html',
})
export class PresentationComponent {
  readonly authService = inject(AuthService);
}
