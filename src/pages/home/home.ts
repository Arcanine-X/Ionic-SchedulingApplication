import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { ItemSliding } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { TaskCreatePage } from '../task-create/task-create';
import { TaskDetailPage } from '../task-detail/task-detail';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  //Stores the tasks
  public items = [];

  //Array which is used for the searching functionality
  public itemsClone = [];

  //Array where the completed tasks get put in
  public completedItems = [];

  //Variables for the altert when deleting tasks
  testRadioOpen: boolean;
  testRadioResult;

  constructor(public alertCtrl: AlertController, 
    private toastCtrl: ToastController, 
    public navCtrl: NavController, 
    public modalCtrl: ModalController) {

  }


  goToProfile(): void {
    this.navCtrl.push("ProfilePage");
  }

  goToCreate(): void {
    this.navCtrl.push('EventCreatePage');
  }

  goToList(): void {
    this.navCtrl.push('EventListPage');
  }


  ionViewDidLoad(){
 
  }
 
  addItem(){
    let addModal = this.modalCtrl.create(TaskCreatePage);
 
    addModal.onDidDismiss((item) => {
          if(item){
            this.saveItem(item);
          }
    });
    addModal.present();
  }
 
  saveItem(item){
    this.items.push(item);
    this.itemsClone.push(item);
  }
 
  viewItem(item){
    this.navCtrl.push(TaskDetailPage, {
      item: item
    });
  }

  /*
  Search bar functionality
  */

  getItemsClone(){
    if(this.items.length == 0){
      return [];
    }
    let toReturn = [];
    for(var i = 0; i < this.items.length; i++){
      toReturn.push(this.items[i]);
    }
    console.log("=> " + toReturn.length);
    return toReturn;
  }

  initializeItems(){
    this.items = this.itemsClone;
  }

  doThis(){
    this.items = this.itemsClone;
    console.log("weaeee");
  }


  getItems(ev) {
    // Reset items back to all of the items
    this.initializeItems();
    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }


  /*
  For the swiping gesture
  */

  complete(item: ItemSliding, index) {
    console.log('Complete Task'); 
    var removed = this.items.splice(index, 1);
    this.completedItems.push(removed);
  }

  delete(item: ItemSliding, index) {
    console.log("Delete");
    this.items.splice(index,1);
  }


  expandAction(item: ItemSliding, _: any, text: string) {
    // TODO item.setElementClass(action, true);
    setTimeout(() => {
      const toast = this.toastCtrl.create({
        message: text
      });
      toast.present();
      // TODO item.setElementClass(action, false);
      item.close();
      setTimeout(() => toast.dismiss(), 2000);
    }, 1500);
  }

  /*
  Alert when deleting
  */


 showConfirm(item, index) {
  const confirm = this.alertCtrl.create({
    title: 'Confirmation',
    message: 'Are you sure you want to delete the task?',
    buttons: [
      {
        text: 'Yes',
        handler: () => {
          console.log('Yes clicked');
          this.delete(item,index);
        }
      },
      {
        text: 'No',
        handler: () => {
          console.log('No clicked');
          return;
        }
      }
    ]
  });
  confirm.present();
}

}