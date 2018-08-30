import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

@Injectable()
export class TasksProvider {
  public eventListRef: firebase.database.Reference;
  public userId;
  constructor() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.eventListRef = firebase
          .database()
          .ref(`/userProfile/${user.uid}/tasksList`);
          this.userId = `${user.uid}`;
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
    firebase.database().ref('userProfile/'+this.userId+'/tasksList/' + key).update({
      taskCategory : item.taskCategory,
      taskDate : item.taskDate,
      taskTitle: item.taskTitle,
      taskDescription: item.taskDescription
    });
  }

  deleteTask(key){
    firebase.database().ref('userProfile/'+this.userId+'/tasksList/' + key).remove();
  }

  deleteCategoryTasks(keyList){
    for(let i = 0; i < keyList.length; i++){
      let key = keyList[i];
      this.deleteTask(key);
    }
  }

  getTasksList(): firebase.database.Reference {
    return this.eventListRef;
  }

  getTaskDetail(eventId:string): firebase.database.Reference {
    return this.eventListRef.child(eventId);
  }
}