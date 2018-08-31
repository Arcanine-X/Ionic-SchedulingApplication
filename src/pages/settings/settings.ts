import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, App, LoadingController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { SettingsProvider } from '../../providers/settings/settings';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  public categoryAlertToggle;
  public taskAlertToggle;
  public settingsKey;
  private loader;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public settingsProvider: SettingsProvider,
              public alertCtrl: AlertController,
              public authProvider: AuthProvider,
              public appCtrl: App,
              public loadingCtrl : LoadingController,
            ) {
  }

  logOut(): void {
    this.authProvider.logoutUser().then(() => {
      this.appCtrl.getRootNav().setRoot(LoginPage);
    });
  }

  
  openProfile(){
    this.navCtrl.push(ProfilePage);
  }

  ionViewDidLoad() {
    this.doLoad();
    this.loadSettings();
  }

  goToProfile(): void {
    this.navCtrl.push(ProfilePage);
  }

  save(){
    this.settingsProvider.updateSettings(this.taskAlertToggle, this.categoryAlertToggle, this.settingsKey);
  }

  alertTest(){
    this.save();
  }

  doLoad(){
    this.loader = this.loadingCtrl.create(
      {
        content: "Please wait...",
      }
    );
    this.loader.present();
  }

  loadSettings(){
    let self = this;
    this.settingsProvider.getSettings().on("value", categoriesList => {
      categoriesList.forEach(snap => {
        this.settingsKey = snap.key;
        this.taskAlertToggle = snap.val().taskAlertToggle,
        this.categoryAlertToggle = snap.val().categoryAlertToggle
      });
      self.loader.dismiss();
    });
  }
}
