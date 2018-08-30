import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import { ItemSliding } from '../../../node_modules/ionic-angular/umd';

@Injectable()
export class TasksProvider {
  items = [];
  filteredItems = [];
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


  fetchFilteredData(categoryName):any {
    this.getTasksList().on("value", eventListSnapshot => {
      this.filteredItems = [];
      eventListSnapshot.forEach(snap => {
        if(snap.val().taskCategory.toLowerCase() === categoryName.toLowerCase()){
          this.filteredItems.push({
          id: snap.key,
          taskTitle: snap.val().taskTitle,
          taskDescription: snap.val().taskDescription,
          taskDate: snap.val().taskDate,
          taskCategory: snap.val().taskCategory
        });
        }
      });
    });
  }

  getFilteredItems(){
    return this.filteredItems;
  }

  fetchData(): any{
    this.getTasksList().on("value", tasksList => {
      tasksList.forEach(snap => {
        this.items.push({
          id: snap.key,
          taskTitle: snap.val().taskTitle,
          taskDescription: snap.val().taskDescription,
          taskDate: snap.val().taskDate,
          taskCategory: snap.val().taskCategory
        });
      });

      this.items.reverse();
    });
  }

  getItems(): any{
    return this.items;
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