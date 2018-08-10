import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TasksProvider } from '../../providers/tasks/task';
import { TaskDetailPage } from '../task-detail/task-detail';
import { CompletedTasksProvider } from '../../providers/tasks/completedTask';
import { HelpProvider } from '../../providers/helper/helper';
import { CategoriesProvider } from '../../providers/tasks/categories';


@Component({
  selector: 'page-category-view',
  templateUrl: 'category-view.html',
})
export class CategoryViewPage {
  public categoryName;
  public categoryItems = [];
  public isSearchbarOpened = false;
  public categoriesList = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public tasksProvider : TasksProvider, public completedTasksProvider : CompletedTasksProvider
            , public helper : HelpProvider, public categoriesProvider : CategoriesProvider) {
    this.categoryName = navParams.get('categoryName');
  }

  ionViewDidLoad() {
    this.populate();
    console.log('Category View Loaded');
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
    // update fb count
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
      return false;
    });
  }



  goToTaskDetail(item, itemId){
    this.navCtrl.push(TaskDetailPage, {
      item: item,
      key: itemId
    });
  }
}
