import { Component, OnInit } from '@angular/core';
import { SignInRequest } from "../../model/sign-in.request";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthenticationService } from "../../services/authentication.service";
import { BaseFormComponent } from "../../../shared/components/base-form.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent extends BaseFormComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  errorMessage: string | null = null; // NUEVO: mensaje de error general

  constructor(private builder: FormBuilder,
              private authenticationService: AuthenticationService,
              private router: Router) {
    super();
    this.form = this.builder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {


    // CONFIGURACIÓN DEL FORMULARIO
    this.form = this.builder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }




  onSubmit() {
    if (this.form.invalid) return;

    const signInRequest = new SignInRequest(
      this.form.value.username,
      this.form.value.password
    );

    this.authenticationService.signIn(signInRequest); // 🔄 ya hace todo internamente
    this.submitted = true;
  }



}
