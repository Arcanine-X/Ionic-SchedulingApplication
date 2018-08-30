import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, App } from 'ionic-angular';
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
              public appCtrl: App
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
    this.loadSettings();
    console.log('Settings page successfully loaded');
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

  loadSettings(){
    this.settingsKey = this.settingsProvider.getKey();
    this.taskAlertToggle = this.settingsProvider.getTaskAlertToggle();
    this.categoryAlertToggle = this.settingsProvider.getCategoryAlertToggle();
  }
}
