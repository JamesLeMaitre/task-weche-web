import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'customDate'
})
export class CustomDatePipePipe implements PipeTransform {

  private months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  transform(value: any, ...args: any[]): any {
    // Check if value is falsy
    if (!value) return value;

    // Convert timestamp to date
    let date = new Date(value*1000);

    // Extract day, month, and year
    let day = date.getDate();
    let month = this.months[date.getMonth()];
    let year = date.getFullYear();

    // Return formatted date string
    return `${day} ${month} ${year}`;
  }

}
