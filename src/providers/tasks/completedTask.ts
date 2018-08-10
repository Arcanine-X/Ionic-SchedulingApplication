import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

@Injectable()
export class CompletedTasksProvider {
  public userId;
  public completedTasksRef: firebase.database.Reference;
  constructor() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.completedTasksRef = firebase
          .database()
          .ref(`/userProfile/${user.uid}/completedTasksList`);
          this.userId = `${user.uid}`;
      }
    });
  }

  addCompletedTask(
    taskTitle: string,
    taskDescription: string,
    taskDate: string,
    taskCategory: string,
    taskCompletionTime: string
  ): firebase.database.ThenableReference {
    return this.completedTasksRef.push({
      taskTitle: taskTitle,
      taskDescription: taskDescription,
      taskDate: taskDate,
      taskCategory: taskCategory,
      taskCompletionTime: taskCompletionTime
    });
  }

  deleteTask(key){
    firebase.database().ref('userProfile/'+this.userId+'/completedTasksList/' + key).remove();
  }

  getCompletedTasks(): firebase.database.Reference {
    return this.completedTasksRef;
  }
}