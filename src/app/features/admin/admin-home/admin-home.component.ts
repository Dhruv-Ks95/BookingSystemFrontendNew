import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})

export class AdminHomeComponent {
  adminName = '';

  constructor(private authService: AuthService, private router: Router) {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.adminName = user.name;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}