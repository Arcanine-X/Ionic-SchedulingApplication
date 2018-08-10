import { Component } from '@angular/core';
import { NavController, 
        ModalController,
        ToastController,
        AlertController,
        ItemSliding,
        LoadingController
      } from 'ionic-angular';
import { TaskCreatePage } from '../task-create/task-create';
import { TaskDetailPage } from '../task-detail/task-detail';
import { TasksProvider } from '../../providers/tasks/task';
import { CompletedTasksProvider } from '../../providers/tasks/completedTask';
import { CategoriesProvider } from '../../providers/tasks/categories';
import { HelpProvider } from '../../providers/helper/helper';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  //For the search bar
  public isSearchbarOpened = false;

  //Stores all the tasks retrvied from firebase which are to be completed
  public items = [];

  //Stores all the completed tasks
  public completedItems = [];

  //Stores the corresponding tasks
  public missedItems = [];
  public todaysItems = [];
  public tomorrowsItems = [];
  public upcomingItems = [];

  //Stores all the categories
  public categoriesList = [];

  //Variables for the altert when deleting tasks
  testRadioOpen: boolean;
  testRadioResult;
  loader;

  constructor(public alertCtrl: AlertController, 
    private toastCtrl: ToastController, 
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    public tasksProvider : TasksProvider  ,
    public completedTasksProvider : CompletedTasksProvider,
    public categoriesProvider : CategoriesProvider,
    public helper : HelpProvider,
    public loadingCtrl : LoadingController  
  ) {

  }

  doLoad(){
    this.loader = this.loadingCtrl.create(
      {
        content: "Please wait...",
      }
    );
    this.loader.present();
  }

  ionViewDidLoad(){
    this.doLoad();
    this.tasksProvider.getTasksList().on("value", tasksList => {
      this.items = [];
      this.todaysItems = [];
      this.tomorrowsItems = [];
      this.upcomingItems = [];
      this.missedItems = [];

      tasksList.forEach(snap => {
        this.items.push({
          id: snap.key,
          taskTitle: snap.val().taskTitle,
          taskDescription: snap.val().taskDescription,
          taskDate: snap.val().taskDate,
          taskCategory: snap.val().taskCategory
        });
      });
      this.items.reverse();
      this.populateToday();
    });
    this.loadCategories();
  }

  loadCategories(){
    let self = this;
    this.categoriesProvider.getCategories().on("value", categoriesList => {
      this.categoriesList = [];
      categoriesList.forEach(snap => {
        this.categoriesList.push({
          id: snap.key,
          categoryName: snap.val().categoryName,
          categoryCount: snap.val().categoryCount
        });
      });
      self.loader.dismiss();
    });
  }

  dateStructure(date){
    var split = date.split('-');
    return split[2] + "-" + split[1] + "-" +split[0];
  }

  populateToday(){
    let today = Date.parse(this.dateStructure(this.helper.getTodaysDate()));
    let tomorrow = Date.parse(this.dateStructure(this.helper.getTomorrowsDate()));
    for(let i  = 0; i < this.items.length; i++){
      let itemDate = Date.parse(this.dateStructure(this.items[i].taskDate));
      if(itemDate == today) this.todaysItems.push(this.items[i]);
      else if(itemDate == tomorrow) this.tomorrowsItems.push(this.items[i]);
      else if(itemDate < today) this.missedItems.push(this.items[i]);
      else if(itemDate > tomorrow) this.upcomingItems.push(this.items[i]);
      else {
        console.log("Shouldn't get in here");
        console.log("Date that got here is " + this.items[i].taskDate);
      }
    }
  }

  goToTaskDetail(item, itemId){
    this.navCtrl.push(TaskDetailPage, {
      item: item,
      key: itemId
    });
  }

  /*
  Complete tasks test
  */
  addToCompletedTasks(item){
    this.completedTasksProvider
      .addCompletedTask(item.taskTitle, item.taskDescription, 
        item.taskDate, item.taskCategory, this.helper.getCompletetionTime()).then(newEvent=>{
          this.delete(item.id, item);
        });
  }

  delete(key, item){
    //update fb count
    let categoryKey = this.findCategoryId(item.taskCategory);
    let count  = this.getCategoryCount(item.taskCategory);
    count--;
    this.categoriesProvider.updateCategoryCount(categoryKey, count, item.taskCategory);
    //then delete
    this.tasksProvider.deleteTask(key);
  }

  getCategoryCount(categoryName : string){
    for(let i = 0; i < this.categoriesList.length; i++){
      if(this.categoriesList[i].categoryName === categoryName){
       return this.categoriesList[i].categoryCount;
      }
    }
    return 0;
  }

  findCategoryId(categoryName : string){
    for(let i = 0;i < this.categoriesList.length; i++){
      if(this.categoriesList[i].categoryName === categoryName){
        return this.categoriesList[i].id;
      }
    }
  }

  addPush(){
    this.navCtrl.push(TaskCreatePage, {
      items: this.items
    });
  }
 
  addItem(){
    let addModal = this.modalCtrl.create(TaskCreatePage);
    addModal.onDidDismiss((item) => {
    });
    addModal.present();
  }
 
  viewItem(item){
    this.navCtrl.push(TaskDetailPage, {
      item: item
    });
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
 showConfirm(item) {
  const confirm = this.alertCtrl.create({
    title: 'Confirmation',
    message: 'Are you sure you want to delete the task?',
    buttons: [
      {
        text: 'Yes',
        handler: () => {
          this.delete(item.id, item);
        }
      },
      {
        text: 'No',
        handler: () => {
          return;
        }
      }
    ]
  });
  confirm.present();
}

  //stupid
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
}