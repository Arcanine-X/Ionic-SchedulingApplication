import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

@Injectable()
export class TasksProvider {
  public eventListRef: firebase.database.Reference;
  constructor() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.eventListRef = firebase
          .database()
          .ref(`/userProfile/${user.uid}/tasksList`);
      }
    });
  }

  createTask(
    taskTitle: string,
    taskDescription: string,
    taskDate: string,
    taskCategory: string
  ): firebase.database.ThenableReference {
    return this.eventListRef.push({
      taskTitle: taskTitle,
      taskDescription: taskDescription,
      taskDate: taskDate,
      taskCategory: taskCategory,
    });
  }

  updateTask(key, item){
    firebase.database().ref('userProfile/gTETPLFSSTXo94gQcLZoboSwn6f2/tasksList/' + key).update({
      taskCategory : item.taskCategory,
      taskDate : item.taskDate,
      taskTitle: item.taskTitle,
      taskDescription: item.taskDescription
    });
  }

  deleteTask(key){
    firebase.database().ref('userProfile/gTETPLFSSTXo94gQcLZoboSwn6f2/tasksList/' + key).remove();
  }

  getTasksList(): firebase.database.Reference {
    return this.eventListRef;
  }

  getTaskDetail(eventId:string): firebase.database.Reference {
    return this.eventListRef.child(eventId);
  }
}