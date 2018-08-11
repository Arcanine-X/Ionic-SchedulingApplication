import { Injectable } from '@angular/core';
import { CategoriesProvider } from '../tasks/categories';


@Injectable()
export class HelpProvider {
  constructor(private categoriesProvider : CategoriesProvider) {

  }


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












  /*
  * Date methods
  */

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










}