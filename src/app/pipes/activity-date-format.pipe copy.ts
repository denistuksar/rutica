import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'activityDate',
  standalone: true
})
export class ActivityDatePipe implements PipeTransform {
  transform(dateString: string): string {
    const date = new Date(dateString)
    const today = new Date()

    const isToday =
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()

    if (isToday) {
      return 'Today'
    }

    const weekday = date.toLocaleDateString(undefined, { weekday: 'short' })
    const day = date.getDate()
    const month = date.toLocaleDateString(undefined, { month: 'short' })

    return `${weekday} ${day} ${month}`
  }
}