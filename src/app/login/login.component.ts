import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/AuthService";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { catchError, of, tap, throwError } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UserLoginRequest } from "../../dtos/request/UserLoginRequest";
import { MatError, MatFormField, MatLabel } from "@angular/material/form-field";
import { NgIf, NgOptimizedImage } from "@angular/common";
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { LocalStorageService } from '../../services/local.storage.service';
import { UserModel } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatError,
    NgIf,
    NgOptimizedImage,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], // Note: Changed `styleUrl` to `styleUrls` for array
  providers: [AuthService],
})
export class LoginComponent  {
  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private localStorageService: LocalStorageService // Updated to use the new LocalStorageService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  /**
   * Handle the login process
   */
  login() {
    if (this.loginForm.valid) {
      const loginRequest: UserLoginRequest = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value,
      };

      this.authService
        .login(loginRequest)
        .pipe(
          tap((response: TokenResponse) => {
            // Save token and user data
            this.localStorageService.setUser(response.user);
            localStorage.setItem('authToken', response.token);
            // Navigate to the admin dashboard
            window.location.href = "/admin"
          }),
          catchError((err) => {
            this.showErrorMessage('Authentication failed. Please check your credentials.');
            return throwError(err);
          })
        )
        .subscribe();
    } else {
      this.showErrorMessage('Please fill in all required fields.');
    }
  }

  /**
   * Display error messages using MatSnackBar
   * @param message Error message to display
   */
  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // Message will disappear after 3 seconds
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}

/**
 * Represents the structure of a TokenResponse returned by the API
 */
export class TokenResponse {
  constructor(public token: string, public user: UserModel) {}
}
