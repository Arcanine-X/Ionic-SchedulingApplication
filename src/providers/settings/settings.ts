import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

@Injectable()
export class SettingsProvider {
    public userId;
    public settingsRef: firebase.database.Reference;
    public taskAlertToggle;
    public soundToggle;
    public categoryAlertToggle;
    public key;
    constructor() {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          this.settingsRef = firebase
            .database()
            .ref(`/userProfile/${user.uid}/settings`);
            this.userId = `${user.uid}`;
        }
      });
    }



  /*
  * Should not be called other then when account is signing up
  */
    setDefaultSettings(
  ): firebase.database.ThenableReference {
    return this.settingsRef.push({
      taskAlertToggle : true,
      categoryAlertToggle : true,
      soundToggle : false
    });
  }

    updateSettings(taskAlert, categoryAlert, key){
      firebase.database().ref('userProfile/'+this.userId+'/settings/' + key).update({
        taskAlertToggle : taskAlert,
        categoryAlertToggle : categoryAlert,
      });    
    }

    getSettings(): firebase.database.Reference {
        return this.settingsRef;
    }

    fetchSettings(){
      this.getSettings().on("value", setting => {
        setting.forEach(snap => {
          this.key = snap.key;
          this.taskAlertToggle = snap.val().taskAlertToggle,
          this.categoryAlertToggle = snap.val().categoryAlertToggle
        });
      });
    }

    getKey(){
      return this.key;
    }

    getTaskAlertToggle(){
      return this.taskAlertToggle;
    }

    getCategoryAlertToggle(){
      return this.categoryAlertToggle;
    }

    

    
}