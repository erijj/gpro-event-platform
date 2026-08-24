import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-button',
  standalone: true,
  templateUrl: './ui-button.html',
  styleUrl: './ui-button.css',
  host: {
    '[attr.disabled]': 'disabled() ? "" : null',
  },
})
export class UiButton {
  variant = input<'primary' | 'danger' | 'ghost'>('primary');
  disabled = input(false);
}
