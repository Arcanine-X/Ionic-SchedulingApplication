import { Injectable } from '@angular/core';


@Injectable()
export class HelpProvider {
  constructor() {

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