import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-user-section',
  imports: [
    CommonModule,
    AvatarModule,
    ButtonModule
  ],
  templateUrl: './user-section.component.html',
  styleUrls: ['./user-section.component.css']
})
export class UserSectionComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  getUserData() {
    return this.authService.getUserData();
  }

  getWorkshopData() {
    return this.authService.getMechanicalWorkshopData();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
