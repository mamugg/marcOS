import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainScreenComponent } from '@features/dock';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MainScreenComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('marcOS');
}
