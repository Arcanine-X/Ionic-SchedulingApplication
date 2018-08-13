import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, App } from 'ionic-angular';
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
  public soundToggle;
  public settingsKey;
  private loader;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public settingsProvider: SettingsProvider,
              public loadingCtrl : LoadingController,
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

  alertTest(){
    if(this.categoryAlertToggle == true){
      this.save();
    }else{
      this.showConfirm();
    }
  }


  showConfirm() {
    const confirm = this.alertCtrl.create({
      title: 'Confirmation',
      message: 'This is not reccomended. Would you like to change your mind?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.categoryAlertToggle = true;
            this.save();
          }
        },
        {
          text: 'No',
          handler: () => {
            this.save();
          }
        }
      ]
    });
    confirm.present();
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
