import { Pipe, PipeTransform } from '@angular/core';

/** Pipe que transforma texto sustituyendolo por puntos suspensivos */
@Pipe({name: 'textoSlice'})
export class TextoSlicePipe implements PipeTransform {
  /**
   * Transformación de un elemento tipo string por si supera los caracteres, se recorte con puntos suspensivos
   *
   * @param value Cadena de texto a tratar
   * @param nCaracteres Número de caracteres
   */
  transform(value: string, nCaracteres: number): string {
    if (value === null || value === undefined) { return ''; }
    if (value.length < nCaracteres) { return value; }
    return value.substr(0, nCaracteres - 3) + '...';
  }

}
