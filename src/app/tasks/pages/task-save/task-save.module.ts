import { TaskSavePageRoutingModule } from './task-save-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TaskSavePage } from './task-save.page';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [SharedModule, TaskSavePageRoutingModule],
  declarations: [TaskSavePage],
})
export class TaskSavePageModule {}
