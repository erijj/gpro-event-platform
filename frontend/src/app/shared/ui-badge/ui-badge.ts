import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-badge',
  standalone: true,
  templateUrl: './ui-badge.html',
  styleUrl: './ui-badge.css',
})
export class UiBadge {
  variant = input<'success' | 'warning' | 'danger' | 'info' | 'neutral'>('neutral');
}
