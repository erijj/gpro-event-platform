import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-input',
  standalone: true,
  templateUrl: './ui-input.html',
  styleUrl: './ui-input.css',
})
export class UiInput {
  label = input('');
  type = input('text');
  placeholder = input('');
  error = input<string | null>(null);
  name = input('');
  value = input('');
}
