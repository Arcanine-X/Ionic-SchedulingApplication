import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

@Injectable()
export class CompletedTasksProvider {
  public completedTasksRef: firebase.database.Reference;
  constructor() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.completedTasksRef = firebase
          .database()
          .ref(`/userProfile/${user.uid}/completedTasksList`);
      }
    });
  }

  addCompletedTask(
    taskTitle: string,
    taskDescription: string,
    taskDate: string,
    taskCategory: string
  ): firebase.database.ThenableReference {
    console.log("hereeeeee");

    return this.completedTasksRef.push({
      taskTitle: taskTitle,
      taskDescription: taskDescription,
      taskDate: taskDate,
      taskCategory: taskCategory,
    });
  }

  getCompletedTasks(): firebase.database.Reference {
    return this.completedTasksRef;
  }


}