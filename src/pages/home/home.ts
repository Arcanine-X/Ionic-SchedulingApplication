import { Component } from '@angular/core';
import { NavController, 
        ModalController,
        ToastController,
        AlertController,
        ItemSliding
      } from 'ionic-angular';
import { TaskCreatePage } from '../task-create/task-create';
import { TaskDetailPage } from '../task-detail/task-detail';
import { TasksProvider } from '../../providers/tasks/task';
import { CompletedTasksProvider } from '../../providers/tasks/completedTask';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public isSearchbarOpened = false;

  //Stores the tasks
  public items = [];

  //Array where the completed tasks get put in
  public completedItems = [];


  //Testing====
  public missedItems = [];
  public todaysItems = [];
  public tomorrowsItems = [];
  public upcomingItems = [];
  //===========

  //Variables for the altert when deleting tasks
  testRadioOpen: boolean;
  testRadioResult;

  constructor(public alertCtrl: AlertController, 
    private toastCtrl: ToastController, 
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    public tasksProvider : TasksProvider  ,
    public completedTasksProvider : CompletedTasksProvider  
  ) {

  }

  goToProfile(): void {
    this.navCtrl.push("ProfilePage");
  }

  testing(){
    let categories = [];
    for(let i = 0; i < this.items.length; i ++){
      let needle = this.items[i].taskCategory;
      if(categories.indexOf(needle) == -1){
        categories.push(needle);
      }
    }
    console.log("Categories length is: " + categories.length);
    console.log("Categories are: " + categories);
  }

  //Was originally empty
  //Test loading from firebase
  ionViewDidLoad(){
    this.tasksProvider.getTasksList().on("value", eventListSnapshot => {
      this.items = [];
      this.todaysItems = [];
      this.tomorrowsItems = [];
      this.upcomingItems = [];
      this.missedItems = [];
      eventListSnapshot.forEach(snap => {
        this.items.push({
          id: snap.key,
          taskTitle: snap.val().taskTitle,
          taskDescription: snap.val().taskDescription,
          taskDate: snap.val().taskDate,
          taskCategory: snap.val().taskCategory
        });
        //return false;
      });

      this.items.reverse();
      this.populateToday();


    });
    console.log(":( ) " + this.items.length);

  }

  populateToday(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    var ddd;
    var mmm;
    if(dd<10) {
      ddd = '0'+dd
    }else{
      ddd = dd;
    } 
    if(mm<10) {
        mmm = '0'+mm
    }else{
      mmm = mm;
    }
    var todayy = yyyy + '-' + mmm + '-' + ddd;

    
    //missed
    for(let i = 0; i < this.items.length; i++){
      if(this.items[i].taskDate < todayy){
       // console.log("yay");
       this.missedItems.push(this.items[i]);
      }
    }

    //today
    for(let i = 0; i < this.items.length; i++){
      if(this.items[i].taskDate == todayy){
        //console.log("wohoo");
        this.todaysItems.push(this.items[i]);
      }
    }
    this.stoopid();

  }


  stoopid(){
    var currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    var day = currentDate.getDate()
    var month = currentDate.getMonth() + 1
    var year = currentDate.getFullYear()
    var dayy;
    var monthh;
    if(day<10) {
      dayy = '0'+day
    }else{
      dayy = day;
    } 
    if(month<10) {
      monthh = '0'+month
    }else{
      monthh = month;
    }
    console.log("----((((((>>>>>");
   var tomorrow = year + "-" + monthh + "-" + dayy;
    //tomorrow
    for(let i = 0; i < this.items.length; i++){
      if(this.items[i].taskDate == tomorrow){
        console.log("weeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
        this.tomorrowsItems.push(this.items[i]);

        console.log("pushed " + this.tomorrowsItems.length);
      }
    }

    console.log("Tomorrows size is " + this.tomorrowsItems.length);

    



        //furture
        for(let i = 0; i < this.items.length; i++){
          console.log(this.items[i].taskDate);
          if(this.items[i].taskDate > tomorrow){
            //console.log("furturistic");
            this.upcomingItems.push(this.items[i]);
          }
        }






  }

  goToTaskDetail(item, itemId){
    console.log("Item ID is: " + itemId);
    this.navCtrl.push(TaskDetailPage, {
      item: item,
      key: itemId
    });
  }

  getCompletetionTime(){
    var currentdate = new Date();

    var datetime = currentdate.getDate() + "/"+(currentdate.getMonth()+1) 
    + "/" + currentdate.getFullYear() + " at " 
    + currentdate.getHours() + ":" 
    + currentdate.getMinutes();
    return datetime;
  }


  /*
  Complete tasks test
  */
  addToCompletedTasks(item){
    this.completedTasksProvider
      .addCompletedTask(item.taskTitle, item.taskDescription, 
        item.taskDate, item.taskCategory, this.getCompletetionTime()).then(newEvent=>{
          this.deleteFB(item.id);
        });
  }

  deleteFB(key){
    console.log("in deletefb");
    this.tasksProvider.deleteTask(key);
  }

  //////////////////////////
 
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
    console.log("in this thinggg");
    this.items.push(item);
  }
 
  viewItem(item){
    this.navCtrl.push(TaskDetailPage, {
      item: item
    });
  }

  /*
  Search bar functionality
  */
  getItems(ev) {
    // Reset items back to all of the items
    this.ionViewDidLoad();
    // set val to the value of the ev target
    var val = ev.target.value;
    // if the value is an empty string don't filter the items

    this.A(ev);
    this.B(ev);
    this.C(ev);
    this.D(ev);

    // if (val && val.trim() != '') {
    //   this.items = this.items.filter((item) => {
    //     return (item.taskTitle.toLowerCase().indexOf(val.toLowerCase()) > -1);
    //   })
    // }
  }
  

  A(ev){
    var val = ev.target.value;

    if (val && val.trim() != '') {
      this.missedItems = this.missedItems.filter((item) => {
        return (item.taskTitle.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  B(ev){
    var val = ev.target.value;

    if (val && val.trim() != '') {
      this.todaysItems = this.todaysItems.filter((item) => {
        return (item.taskTitle.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  C(ev){
    var val = ev.target.value;

    if (val && val.trim() != '') {
      this.tomorrowsItems = this.tomorrowsItems.filter((item) => {
        return (item.taskTitle.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  D(ev){
    var val = ev.target.value;

    if (val && val.trim() != '') {
      this.upcomingItems = this.upcomingItems.filter((item) => {
        return (item.taskTitle.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }


  /*
  For the swiping gesture
  */

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
          this.deleteFB(item.id);
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