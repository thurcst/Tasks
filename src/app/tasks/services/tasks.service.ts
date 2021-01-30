import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Firestore } from 'src/app/core/classes/firestore.class';
import { AuthService } from 'src/app/core/services/auth.service';
import { Task } from '../components/models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TasksService extends Firestore<Task> {
  constructor(db: AngularFirestore, private authService: AuthService) {
    super(db);
    this.init();
  }

  private init(): void {
    this.authService.authState$.subscribe((user) => {
      if (user) {
        this.setCollection(`/users/${user.uid}/tasks`, (ref) =>
          ref.orderBy('done', 'desc').orderBy('title', 'asc'),
        );
        return;
      }
      this.setCollection(null);
    });
  }
}
