import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'durationFormat',
  standalone: true
})
export class DurationFormatPipe implements PipeTransform {
  transform(seconds: number): string {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60

    if (h > 0) {
      return `${h}h${m > 0 ? ` ${m}m` : ''}`
    } else {
      const parts = []
      if (m > 0) parts.push(`${m}m`)
      if (s > 0 || m === 0) parts.push(`${s}s`)
      return parts.join(' ')
    }
  }
}