import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-toast-notifier',
  standalone: true,
  imports: [CommonModule, ToastModule],
  templateUrl: './toast-notifier.component.html',
  styleUrl: './toast-notifier.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastNotifierComponent {}

