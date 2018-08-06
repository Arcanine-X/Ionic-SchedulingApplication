import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TasksProvider } from '../../providers/tasks/task';
import { CategoryViewPage } from '../category-view/category-view';


@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
})
export class CategoriesPage {
  public categoriesList = [];
  public itemsList = [];
  public itemsInCategory;

  public testArray = [];
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public tasksProvider : TasksProvider) {
    
  }

  ionViewDidLoad() {
    //get all the items
    this.tasksProvider.getTasksList().on("value", eventListSnapshot => {
      this.itemsList = [];
      eventListSnapshot.forEach(snap => {
        this.itemsList.push({
          id: snap.key,
          taskTitle: snap.val().taskTitle,
          taskDescription: snap.val().taskDescription,
          taskDate: snap.val().taskDate,
          taskCategory: snap.val().taskCategory
        });
      });
    });

    //populate the categories
    this.categoriesList = [];

    for(let i = 0; i < this.itemsList.length; i++){
      let itemCategory = this.itemsList[i].taskCategory.toLowerCase();
      let itemMap = {
        title : this.itemsList[i].taskCategory,
        total : -1
      };

      if(!this.categoriesContains(itemCategory)){
        itemMap.total = 1;
        this.categoriesList.push(itemMap);
      }else{
        let indexToEdit = this.categoryIndex(itemCategory);
        this.categoriesList[indexToEdit].total++;
      }
    }


  }


  private categoryIndex(categoryTitle){
    for(let i = 0; i < this.categoriesList.length; i++){
      if(this.categoriesList[i].title === categoryTitle){
        return i;
      }
    }
    return -1;
  }

  private categoriesContains(categoryTitle) : boolean{
    for(let i = 0; i < this.categoriesList.length; i++){
      if(this.categoriesList[i].title === categoryTitle){
        return true;
      }
    }
    return false;
  }

  debugger(){
    console.log("in debugger");
    console.log(this.testArray.length);
    console.log(this.testArray);
  }

  openCategory(categoryName){
    this.navCtrl.push(CategoryViewPage, {
      categoryName : categoryName
    })
  }



   

}
