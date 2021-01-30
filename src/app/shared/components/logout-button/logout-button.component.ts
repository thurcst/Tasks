import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth.service';
import { OverlayService } from 'src/app/core/services/overlay.service';

@Component({
  selector: 'app-logout-button',
  templateUrl: './logout-button.component.html',
  styleUrls: ['./logout-button.component.scss'],
})
export class LogoutButtonComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private overlayService: OverlayService,
  ) {}

  ngOnInit() {}

  async logout(): Promise<void> {
    await this.overlayService.alert({
      message: `Do you really wan't to logout?`,
      buttons: [
        {
          text: 'Yes',
          handler: async () => {
            await this.authService.logout();
            this.navCtrl.navigateRoot('/login');
          },
        },

        'No',
      ],
    });
  }
}
