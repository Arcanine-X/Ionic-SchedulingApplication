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

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public tasksProvider : TasksProvider) {
                console.log("constructorrrrrrr");
    
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
        title : this.itemsList[i].taskCategory.toLowerCase(),
        total : -1,
        letter: this.itemsList[i].taskCategory.substring(0,1).toUpperCase()
      };

      if(!this.categoriesContains(itemCategory)){
        itemMap.total = 1;
        this.categoriesList.push(itemMap);
      }else{
        console.log("---->" + itemCategory);
        let indexToEdit = this.categoryIndex(itemCategory);
        this.categoriesList[indexToEdit].total++;
      }
    }

    //Uppercase first letter to make it look nicer
    for(let i = 0; i < this.categoriesList.length; i++){
      this.categoriesList[i].title = this.capitalizeFirstLetter(this.categoriesList[i].title);
    }

    //sort it 
    this.selectionSort(this.categoriesList);
  }

  
  capitalizeFirstLetter(string) :string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }



  private categoryIndex(categoryTitle){
    for(let i = 0; i < this.categoriesList.length; i++){
      if(this.categoriesList[i].title === categoryTitle.toLowerCase()){
        return i;
      }
    }
    return -1;
  }

  private categoriesContains(categoryTitle) : boolean{
    for(let i = 0; i < this.categoriesList.length; i++){
      if(this.categoriesList[i].title === categoryTitle.toLowerCase()){
        return true;
      }
    }
    return false;
  }

/*
Selection sorts by a natural sort of alphanumerical strings
*/
selectionSort(arr){
  let i,m,j;
  for (i = -1; ++i < arr.length;) {
    for (m = j = i; ++j < arr.length;) {
      if (this.selectionSortComparator(arr[m].title, arr[j].title)) m = j;
    }
    [arr[m], arr[i]] = [arr[i], arr[m]];
 }
 return arr;
}

/*
Comparator method for selection sort using localeCompare. By passing the
numeric: true option, it will smartly recognize numbers. You can do case-insensitive using sensitivity: 'base'
*/
selectionSortComparator(a, b){
	var arr = [];
	arr.push(a);
	arr.push(b);
	var collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
	arr.sort(collator.compare);
	if(arr[0] == a){
		return false;
	}else{
		return true;
	}
}


  debugger(){
    var currentdate = new Date();

    var datetime = currentdate.getDate() + "/"+(currentdate.getMonth()+1) 
    + "/" + currentdate.getFullYear() + " at " 
    + currentdate.getHours() + ":" 
    + currentdate.getMinutes();
    console.log(datetime);

    console.log(this.categoriesList);
  }

  openCategory(categoryName){
    this.navCtrl.push(CategoryViewPage, {
      categoryName : categoryName
    })
  }


}
