import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-task-restore',
  templateUrl: 'task-restore.html',
})
export class TaskRestorePage {
  item;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
      this.item = navParams.get('item');
    }
  
    ionViewDidLoad() {
    }
}
