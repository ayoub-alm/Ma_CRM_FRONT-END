import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: any[];
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  @Input() events: any[] = [];
  @Input() dateField: string = 'planningDate';
  @Output() eventClick = new EventEmitter<any>();

  currentDate: Date = new Date();
  calendarDays: CalendarDay[] = [];
  weekDays: string[] = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  monthNames: string[] = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  ngOnInit(): void {
    this.generateCalendar();
  }

  ngOnChanges(): void {
    this.generateCalendar();
  }

  generateCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();

    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const lastDate = lastDay.getDate();

    // Previous month's last days
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    this.calendarDays = [];

    // Add previous month's days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      this.calendarDays.push({
        date,
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        isToday: false,
        events: this.getEventsForDate(date)
      });
    }

    // Add current month's days
    const today = new Date();
    for (let day = 1; day <= lastDate; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === today.toDateString();
      this.calendarDays.push({
        date,
        day,
        isCurrentMonth: true,
        isToday,
        events: this.getEventsForDate(date)
      });
    }

    // Add next month's days to complete the grid
    const remainingDays = 42 - this.calendarDays.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      this.calendarDays.push({
        date,
        day,
        isCurrentMonth: false,
        isToday: false,
        events: this.getEventsForDate(date)
      });
    }
  }

  getEventsForDate(date: Date): any[] {
    return this.events.filter(event => {
      const eventDate = new Date(event[this.dateField]);
      return eventDate.toDateString() === date.toDateString();
    });
  }

  previousMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );
    this.generateCalendar();
  }

  today(): void {
    this.currentDate = new Date();
    this.generateCalendar();
  }

  onEventClick(event: any): void {
    this.eventClick.emit(event);
  }

  getEventStatusClass(event: any): string {
    // Check if event has a report (completed) or not (pending)
    if (event.report && event.report !== '') {
      return 'event-complete'; // Green for completed
    }
    return 'event-pending'; // Red/Orange for pending
  }

  get currentMonthYear(): string {
    return `${this.monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
  }
}
