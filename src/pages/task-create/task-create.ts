import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { TasksProvider } from '../../providers/tasks/task';
import { CategoriesProvider } from '../../providers/tasks/categories';

@Component({
  selector: 'page-task-create',
  templateUrl: 'task-create.html',
})
export class TaskCreatePage {
  title: string;
  description: string;
  itemsList = [];
  categoriesList = [];
  public eventDate:string=new Date().toISOString();

  constructor(public navCtrl: NavController, 
              public view: ViewController,
              public tasksProvider: TasksProvider,
              public navParams: NavParams,
              public categoriesProvider : CategoriesProvider) {
              this.itemsList = navParams.get('items');
              console.log(navParams.get('items'));
                console.log("Length is " + this.itemsList.length);
                console.log(this.itemsList);
                //this.populateCategory();

  }



  ////////////////////////// Put in provider
  populateCategory(){
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
    console.log("This is the size: " + this.categoriesList.length);
    console.log("List is " + this.categoriesList);
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
  selectionSortComparator(a, b) {
    var arr = [];
    arr.push(a);
    arr.push(b);
    var collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    arr.sort(collator.compare);
    if (arr[0] == a) {
      return false;
    } else {
      return true;
    }
  }


  loadCategories(){
    this.categoriesProvider.getCategories().on("value", categoriesList => {
      this.categoriesList = [];
      categoriesList.forEach(snap => {
        console.log("got close");
        console.log(snap.key);
        console.log(snap.val().categoryName);
        this.categoriesList.push({
          id: snap.key,
          categoryName: snap.val().categoryName,
          categoryCount: snap.val().categoryCount
        });
        console.log("pushed i guess");
        console.log(this.categoriesList.length);
        //return false;
      });
    });
  }











  /////////////////////////////////////////////////

  ionViewDidLoad() {
    console.log('Task Create Page Successfully Loadd');
    this.loadCategories();
  }

  close(){
    this.view.dismiss();
  }

  findCategoryCount(categoryName : string){
    for(let i = 0; i < this.categoriesList.length; i++){
      if(this.categoriesList[i].categoryName === categoryName){
        let original = this.categoriesList[i].categoryCount;
        return original + 1;
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


  createEvent(
    taskTitle: string,
    taskDescription: string,
    taskDate: string,
    taskCategory: string
  ): void {
    let newCategoryCount = this.findCategoryCount(taskCategory);
    let categoryId = this.findCategoryId(taskCategory);
    //format inputs

    taskDate = this.formatDate(taskDate);
    taskDescription = this.formatDescription(taskDescription);
    taskCategory = this.formatCategory(taskCategory);
    this.tasksProvider
      .createTask(taskTitle, taskDescription, taskDate, taskCategory)
      .then(newEvent => {
        console.log("in new event");
        this.categoriesProvider.updateCategoryCount(categoryId, newCategoryCount, taskCategory);
        this.navCtrl.pop();
      });
  }

  /*
  * Takes in a date in the format of 2018-08-07 which is converted
  * into 07-08-2018, reversing the date.
  */
  formatDate(date){
    if(date == undefined){
      console.log(this.getTodaysDate());
      return this.getTodaysDate();
    }
    var newDate = date.substring(9,10);
    var year = date.substring(0,4);
    var month = date.substring(5,7);
    var day = date.substring(8,10);
    return day+"-"+month+"-"+year;
  }

  formatDescription(taskDescription){
    if(taskDescription == undefined){
      return " ";
    }
    return taskDescription;
  }

  formatCategory(taskCategory){
    if(taskCategory == undefined){
      return "Default";
    }
    return taskCategory;
  }

  getTodaysDate(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    dd = this.formatDays(dd);
    mm = this.formatMonths(mm);
    return dd + '-' + mm + '-' + yyyy;
  }

  formatDays(dd){
    if(dd < 10) return '0' + dd;
    return dd;
  }

  formatMonths(mm){
    if(mm < 10) return '0' + mm;
    return mm;
  }
}
