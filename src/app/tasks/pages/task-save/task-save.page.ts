import { JsonPipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { Task } from '../../components/models/task.model';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-task-save',
  templateUrl: './task-save.page.html',
  styleUrls: ['./task-save.page.scss'],
})
export class TaskSavePage implements OnInit {
  taskForm: FormGroup;
  pageTitle = '...';
  taskId: string = undefined;

  response: Task = { done: true, id: 'NA', title: 'NA' };
  sending = false;
  sent = false;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private overlayService: OverlayService,
    private route: ActivatedRoute,
    private tasksService: TasksService,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.init();
  }

  async delete(task: Task): Promise<void> {
    console.log(this.taskId);
    await this.overlayService.alert({
      message: `Do you  really wan't to delete the task "${task.title}"?`,
      buttons: [
        {
          text: 'Yes',
          handler: async () => {
            await this.tasksService.delete({
              id: this.taskId,
              ...this.taskForm.value,
            });
            await this.overlayService.toast({
              message: `Task ${task.title} deleted.`,
            });
            this.navCtrl.navigateBack('/tasks');
          },
        },
        {
          text: 'No',
        },
      ],
    });
  }

  init(): void {
    const taskId = this.route.snapshot.paramMap.get('id');
    if (!taskId) {
      this.pageTitle = 'Create Task';
      return;
    }
    this.taskId = taskId;
    this.pageTitle = 'Edit task';
    this.tasksService
      .get(taskId)
      .pipe(take(1))
      .subscribe(({ title, done }) => {
        this.taskForm.get('title').setValue(title);
        this.taskForm.get('done').setValue(done);
      });
  }

  private createForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      done: [false],
    });
  }

  async onSubmit(): Promise<void> {
    try {
      if (!this.taskId) {
        const task = await this.tasksService
          .create(this.taskForm.value)
          .then((res) => (this.response = res));
        console.log('Task created: ', task);
      } else {
        await this.tasksService.update({
          id: this.taskId,
          ...this.taskForm.value,
        });
      }

      this.navCtrl.navigateBack('/tasks');
    } catch (error) {
      console.log('Error: ', error, '\n', 'Task: ', this.taskForm.value);
      await this.overlayService.toast({
        message: error.message,
      });
    }
  }

  success(): boolean {
    this.sending = false;
    this.sent = true;
    return this.response.id !== 'NA' ? true : false;
  }
}
