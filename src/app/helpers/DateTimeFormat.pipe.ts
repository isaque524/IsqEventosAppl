import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from '../util/constants';

@Pipe({
  name: 'DateTimeFormat',
})
export class DateTimeFormatPipe extends DatePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    // Arredondar a data para o minuto mais próximo
    const roundedDate = this.roundDateToNearestMinute(value);
    return super.transform(roundedDate, Constants.DATE_TIME_FMT);
  }

  // Função para arredondar a data para o minuto mais próximo
  roundDateToNearestMinute(date: Date): Date {
    const roundedDate = new Date(date); // Criar uma cópia da data original
    const seconds = roundedDate.getSeconds(); // Obter os segundos atuais

    // Arredondar os segundos para o minuto mais próximo
    const roundedSeconds = Math.round(seconds / 60) * 60;

    // Definir os segundos arredondados na data
    roundedDate.setSeconds(roundedSeconds);

    return roundedDate; // Retornar a data arredondada
  }
}
