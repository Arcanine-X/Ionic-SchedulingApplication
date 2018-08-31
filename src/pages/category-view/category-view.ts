import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { TasksProvider } from '../../providers/tasks/task';
import { TaskDetailPage } from '../task-detail/task-detail';
import { CompletedTasksProvider } from '../../providers/tasks/completedTask';
import { HelpProvider } from '../../providers/helper/helper';
import { CategoriesProvider } from '../../providers/tasks/categories';
import { TaskCreateCategoryPage } from '../task-create-category/task-create-category';

@Component({
  selector: 'page-category-view',
  templateUrl: 'category-view.html',
})
export class CategoryViewPage {
  public categoryName;
  public categoryItems = [];
  public isSearchbarOpened = false;
  public categoriesList = [];
  public filteredItems = [];
  public loader;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public tasksProvider : TasksProvider, 
    public completedTasksProvider : CompletedTasksProvider, 
    public helper : HelpProvider, 
    public loadingCtrl : LoadingController,
    public categoriesProvider : CategoriesProvider) {
    this.categoryName = navParams.get('categoryName');
  }

  ionViewDidLoad() {
    this.populate();

  }

  populate(){
    //get all the items
    this.tasksProvider.getTasksList().on("value", eventListSnapshot => {
      this.categoryItems = [];
      eventListSnapshot.forEach(snap => {
        if(snap.val().taskCategory.toLowerCase() === this.categoryName.toLowerCase()){
          this.categoryItems.push({
          id: snap.key,
          taskTitle: snap.val().taskTitle,
          taskDescription: snap.val().taskDescription,
          taskDate: snap.val().taskDate,
          taskCategory: snap.val().taskCategory
        });
        }
      });
    });
  }

  doLoad(){
    this.loader = this.loadingCtrl.create(
      {
        content: "Please wait...",
      }
    );
    this.loader.present();
  }

  createTaskInCategory(){
    this.navCtrl.push(TaskCreateCategoryPage,
      {
        categoryName : this.categoryName
      });
  }

  getItems(ev) {
    // Reset items back to all of the items
    this.ionViewDidLoad();
    // set val to the value of the ev target
    var val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.categoryItems = this.categoryItems.filter((item) => {
        return (item.taskTitle.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
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
    this.loadCategories();
    // update count for items in category in firebase
    let categoryKey = this.helper.findCategoryId(this.categoriesList, item.taskCategory);
    let count  = this.helper.getCategoryCount(this.categoriesList, item.taskCategory);
    count--;
    this.categoriesProvider.updateCategoryCount(categoryKey, count, item.taskCategory);
    //then delete
    this.tasksProvider.deleteTask(key);
  }

  goToTaskDetail(item, itemId){
    this.navCtrl.push(TaskDetailPage, {
      item: item,
      key: itemId
    });
  }

  loadCategories(){
    this.categoriesProvider.getCategories().on("value", categoriesList => {
      this.categoriesList = [];
      categoriesList.forEach(snap => {
        this.categoriesList.push({
          id: snap.key,
          categoryName: snap.val().categoryName,
          categoryCount: snap.val().categoryCount
        });
      });
      return false;
    });
  }
}
