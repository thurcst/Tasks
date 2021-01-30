import { NgModule } from '@angular/core';
import { MenuComponent } from './menu/menu.component';
import { SharedModule } from '../shared.module';
import { AppRoutingModule } from 'src/app/app-routing.module';

@NgModule({
  declarations: [MenuComponent],
  imports: [SharedModule, AppRoutingModule],
  exports: [MenuComponent],
})
export class ComponentsModule {}
