import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'paceFormat',
  standalone: true
})
export class PaceFormatPipe implements PipeTransform {
  transform(value: number): string {
    const minutes = Math.floor(value / 60)
    const seconds = Math.round(value % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }
}