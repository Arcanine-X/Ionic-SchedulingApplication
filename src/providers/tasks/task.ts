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
          .ref(`/userProfile/${user.uid}/eventList`);
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

  /*
  Key is the id
  Item stores all the information for the task being updated
  */
  updateTask(key, item){
    console.log("Event list reference is " + this.eventListRef);
    //this.eventListRef.update(key);
   // let reference = '/eventList/' + key;
    //firebase.database().ref(reference).update(item);
    //var updates = {};
   // updates['/eventsList/'+key] = "hello";
    //firebase.database().ref().update(updates);

    // this.getTasksList().update({
    //   key : {
    //     taskTitle : "ffssss work"
    //   }
    // });

    console.log("FFFFFFS " + key);

    firebase.database().ref('userProfile/gTETPLFSSTXo94gQcLZoboSwn6f2/eventList/' + key).update({
      taskCategory : item.taskCategory,
      taskDate : item.taskDate,
      taskTitle: item.taskTitle,
      taskDescription: item.taskDescription
    });

    // this.eventListRef.update({
    //   key : {
    //     taskCategory : item.taskCategory,
    //     taskDate : item.taskDate,
    //     taskTitle: item.taskTitle,
    //     taskDescription: "hello"
    //   }
    // });

  }

  deleteTask(key){
    console.log(firebase.database().ref);
    console.log("Key in task.ts is " + key);
    let reference = '/eventList/' + key;

    //this.eventListRef.remove(key);
    firebase.database().ref('userProfile/gTETPLFSSTXo94gQcLZoboSwn6f2/eventList/' + key).remove();
    }

  getTasksList(): firebase.database.Reference {
    return this.eventListRef;
  }

  getTaskDetail(eventId:string): firebase.database.Reference {
    return this.eventListRef.child(eventId);
  }
}