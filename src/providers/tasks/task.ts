import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

@Injectable()
export class EventProvider {
  public eventListRef: firebase.database.Reference;
  constructor() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.eventListRef = firebase
          .database()
          .ref(`/userProfile/${user.uid}/eventList`);
      }
    });
  }

  createTask(
    taskTitle: string,
    taskDesciption: string,
    taskDate: string,
    taskCategory: string
  ): firebase.database.ThenableReference {
    return this.eventListRef.push({
      title: taskTitle,
      description: taskDesciption,
      date: taskDate,
      taskCategory: taskCategory,
    });
  }

  getTasksList(): firebase.database.Reference {
    return this.eventListRef;
  }

  getTaskDetail(eventId:string): firebase.database.Reference {
    return this.eventListRef.child(eventId);
  }
}