import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-card',
  standalone: true,
  templateUrl: './ui-card.html',
  styleUrl: './ui-card.css',
})
export class UiCard {
  hoverable = input(false);
}
