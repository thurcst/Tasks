import { OverlayService } from 'src/app/core/services/overlay.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthProvider } from 'src/app/core/services/auth.types';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  authForm: FormGroup;

  authProviders = AuthProvider;

  config = {
    isSignIn: true,
    action: 'Login',
    actionChange: 'Create Account',
  };

  private nameControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
  ]);

  constructor(
    private overlayService: OverlayService,
    private authService: AuthService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  private createForm(): void {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  get email(): FormControl {
    return this.authForm.get('email') as FormControl;
  }
  get password(): FormControl {
    return this.authForm.get('password') as FormControl;
  }

  get name(): FormControl {
    return this.authForm.get('name') as FormControl;
  }

  changeAuthAction(): void {
    this.config.isSignIn = !this.config.isSignIn;
    const { isSignIn } = this.config;
    this.config.action = isSignIn ? 'Login' : 'Sign Up';
    this.config.actionChange = isSignIn
      ? 'Create account'
      : 'Already have an account';
    !isSignIn
      ? this.authForm.addControl('name', this.nameControl)
      : this.authForm.removeControl('name');
  }

  async onSubmit(provider: AuthProvider): Promise<void> {
    // Check what is in this form
    // console.log('AuthForm: ', this.authForm.value);

    const loading = await this.overlayService.loading();

    try {
      const credentials = await this.authService.authenticate({
        isSignIn: this.config.isSignIn,
        user: this.authForm.value,
        provider,
      });

      console.log('Authenticated', credentials);
      this.navCtrl.navigateForward(
        this.route.snapshot.queryParamMap.get('redirect') || 'tasks',
      );
    } catch (error) {
      console.log('Error:', error);
      this.overlayService.toast({
        message: error.message,
        color: 'danger',
      });
    } finally {
      loading.dismiss();
    }
  }
}
