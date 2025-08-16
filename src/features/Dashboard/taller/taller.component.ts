import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
@Component({
  selector: 'app-taller',
  imports: [],
  templateUrl: './taller.component.html',
  styleUrl: './taller.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TallerComponent implements OnInit {
  MW: any;
  constructor(private authService: AuthService) {
    this.MW = this.authService.mechanicalWorkshop();
  }



  ngOnInit() {
    this.printData();
  }

  printData() {
    console.log(this.MW);
  }
}
