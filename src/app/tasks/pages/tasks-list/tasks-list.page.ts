import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { Task } from '../../components/models/task.model';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.page.html',
  styleUrls: ['./tasks-list.page.scss'],
})
export class TasksListPage implements OnInit {
  title = 'Aprender Ionic';

  tasks$: Observable<Task[]>;

  tasksLoaded = false;

  constructor(
    private navCtrl: NavController,
    private tasksService: TasksService,
    private overlayService: OverlayService,
  ) {}

  async ngOnInit(): Promise<void> {}

  async ionViewWillEnter(): Promise<void> {
    this.tasks$ = this.tasksService.getAll();
    this.tasks$.pipe(take(1)).subscribe((tasks) => {
      this.tasksLoaded = true;
      console.log(tasks);
    });
  }

  onUpdate(task: Task): void {
    this.navCtrl.navigateForward(`/tasks/edit/${task.id}`);
  }

  async onDelete(task: Task): Promise<void> {
    await this.overlayService.alert({
      message: `Do you  really wan't to delete the task "${task.title}"?`,
      buttons: [
        {
          text: 'Yes',
          handler: async () => {
            await this.tasksService.delete(task);
            await this.overlayService.toast({
              message: `Task ${task.title} deleted.`,
            });
          },
        },
        {
          text: 'No',
        },
      ],
    });
  }

  async onDone(task: Task): Promise<void> {
    const taskToUpdate = { ...task, done: !task.done };
    await this.tasksService.update(taskToUpdate);
    this.overlayService.toast({
      message: `Task "${task.title}" ${
        taskToUpdate.done ? 'completed' : 'updated'
      }!`,
    });
  }
}
