import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

@Injectable()
export class SettingsProvider {
    public userId;
    public settingsRef: firebase.database.Reference;
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

    updateDeleteTaskAlert(){

    }

    updateDeleteCategoryAlert(){

    }

    updateSoundNotification(){

    }

    getSettings(): firebase.database.Reference {
        return this.settingsRef;
    }
}