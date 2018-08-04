import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TaskDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-task-detail',
  templateUrl: 'task-detail.html',
})
export class TaskDetailPage {
  title;
  description;
  inputDescription;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.title = this.navParams.get('item').title;
    this.description = this.navParams.get('item').description;
  }

  updateDetails(){
    //console.log("sweet");
    //this.description = "changed";

  }

  saveDes(){
    this.navParams.get('item').title = this.title;
    this.navParams.get('item').description = this.description;
    document.getElementById("saveButton").innerHTML = "Saved";
  }

  unsave(){
    console.log("init");
    document.getElementById("saveButton").innerHTML = "Save";
  }

}
