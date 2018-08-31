import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

@Injectable()
export class CategoriesProvider {
  public categoriesList = [];
  public userId;
  public completedTasksRef: firebase.database.Reference;
  constructor() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.completedTasksRef = firebase
          .database()
          .ref(`/userProfile/${user.uid}/categoriesList`);
          this.userId = `${user.uid}`;
      }
    });
  }


  addCategory(
      categoryName: string
  ): firebase.database.ThenableReference {
    return this.completedTasksRef.push({
      categoryName: categoryName,
      categoryCount: 0,
      categoryLetter : categoryName.substring(0,1).toUpperCase()
    });
  }

  updateCategoryCount(key, newCount, name){
    firebase.database().ref('userProfile/'+this.userId+'/categoriesList/' + key).update({
      categoryName : name,
      categoryCount : newCount
    });
  }

  deleteCategory(key){
    firebase.database().ref('userProfile/'+this.userId+'/categoriesList/' + key).remove();
  }

  getCategories(): firebase.database.Reference {
    return this.completedTasksRef;
  }
}