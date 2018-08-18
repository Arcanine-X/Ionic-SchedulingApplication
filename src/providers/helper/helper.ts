import { Injectable } from '@angular/core';
import { CategoriesProvider } from '../tasks/categories';


@Injectable()
export class HelpProvider {
  constructor(private categoriesProvider : CategoriesProvider) {

  }

  //Sorting Algorithims//

  /*
  Selection sorts by a natural sort of alphanumerical strings
  */
 sortCategoryNames(arr){
  let i,m,j;
  for (i = -1; ++i < arr.length;) {
    for (m = j = i; ++j < arr.length;) {
      if (this.selectionSortComparator(arr[m].categoryName, arr[j].categoryName)) m = j;
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

  //Text Formatters//

  formatDate(date){
    return this.convertToNZDate(date);
  }

  formatDescription(taskDescription){
    return taskDescription == undefined ? "Empty" : taskDescription; 
  }

  formatCategory(taskCategory){
    return taskCategory == undefined ? "Default" : taskCategory; 
  }

  formatTitle(taskTitle){
    return taskTitle == undefined ? "Unlabelled" : taskTitle; 
  }



  //Date Methods//

  /*
  * Returns todays date in the format of: dd-mm-yyyy
  */
 getTodaysDate(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    dd = this.formatDays(dd);
    mm = this.formatMonths(mm);
    return dd + '-' + mm + '-' + yyyy;
  }

  /*
  * Returns tomorrows date in the formate of: dd-mm-yyyy
  */
 getTomorrowsDate(){
    var currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    var day = currentDate.getDate()
    var month = currentDate.getMonth() + 1
    var year = currentDate.getFullYear()
    day = this.formatDays(day);
    month = this.formatMonths(month);
    return day + "-" + month + "-" + year;
  }

  /*
  * Formats days so if the day is 7, it will return 07
  */
  formatDays(dd){
    if(dd < 10) return '0' + dd;
    return dd;
  }

  /*
  * Formats motns so if the month is 7, it will return 07
  */
  formatMonths(mm){
    if(mm < 10) return '0' + mm;
    return mm;
  }

  /*
  * Returns the current time
  */
  getCompletetionTime(){
    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/"+(currentdate.getMonth()+1) 
    + "/" + currentdate.getFullYear() + " at " 
    + currentdate.getHours() + ":" 
    + currentdate.getMinutes();
    return datetime;
  }

  /*
  * Converts date formats as such: 2018-08-18T01:35:44.245Z and returns
  * the following: 18-08-2018
  */
  convertToNZDate(date){
    if(date == undefined){
      return this.getTodaysDate();
    }
    let split = date.split("-");
    return split[2].split("T")[0] + "-" + split[1] + "-" + split[0];
  }



  //Category Methods//


  findCategoryId(categoriesList, categoryName : string) : string{
    for(let i = 0;i < categoriesList.length; i++){
      if(categoriesList[i].categoryName === categoryName){
        return categoriesList[i].id;
      }
    }
  }

  /*
  * Returns the original category count + 1
  */
  getIncreaseCategoryCount(categoriesList, categoryName : string) : number{
    for(let i = 0; i < categoriesList.length; i++){
      if(categoriesList[i].categoryName === categoryName){
        let original = categoriesList[i].categoryCount;
        return original + 1;
      }
    }
    return 0;
  }

  




}