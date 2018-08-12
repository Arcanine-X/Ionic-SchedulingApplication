import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { SettingsProvider } from '../../providers/settings/settings';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  public categoryAlertToggle;
  public taskAlertToggle;
  public soundToggle;
  public settingsKey;
  private loader;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public settingsProvider: SettingsProvider,
              public loadingCtrl : LoadingController,
            ) {
  }

  ionViewDidLoad() {
    this.doLoad();

    this.loadSettings();
    console.log('Settings page successfully loaded');
    console.log("Bloop is ");
  }

  goToProfile(): void {
    this.navCtrl.push(ProfilePage);
  }

  doLoad(){
    this.loader = this.loadingCtrl.create(
      {
        content: "Please wait...",
      }
    );
    this.loader.present();
  }

  save(){
    this.settingsProvider.updateSettings(this.taskAlertToggle, this.categoryAlertToggle, this.soundToggle, this.settingsKey);
  }


  loadSettings(){
    let self = this;
    this.settingsProvider.getSettings().on("value", categoriesList => {
      categoriesList.forEach(snap => {
        this.settingsKey = snap.key;
        this.taskAlertToggle = snap.val().taskAlertToggle,
        this.categoryAlertToggle = snap.val().categoryAlertToggle,
        this.soundToggle = snap.val().soundToggle
      });
      self.loader.dismiss();
    });
  }


  debug(){
    console.log("debug");
    console.log(this.settingsKey);
    console.log(this.soundToggle);
    console.log(this.categoryAlertToggle);
    console.log(this.taskAlertToggle);

  }

}
