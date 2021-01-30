import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Pages } from '../../interfaces/pages.types';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  @Input() pages: Pages[];

  user: firebase.default.User;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.authState$.subscribe((user) => (this.user = user));
  }
}
