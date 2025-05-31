import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthenticationService } from "../../services/authentication.service";
import { SignUpRequest } from "../../model/sign-up.request";
import { BaseFormComponent } from "../../../shared/components/base-form.component";
import { SignInInfo } from '../../model/sign-in-info';
import { StorageService } from "../../../shared/services/storage.service";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent extends BaseFormComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  image: string | null = null;
  selectedFileName: string = '';
  formErrorMessage: string | null = null;
  imageErrorMessage: string | null = null;


  constructor(
    private builder: FormBuilder,
    private authenticationService: AuthenticationService,
    private storageService: StorageService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.builder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      photo: ['', Validators.required]
    });
  }

  uploadImage(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.selectedFileName = file.name;
      let reader = new FileReader();
      let name = "USER_PROFILE_" + Date.now();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        this.storageService.uploadFile(name, reader.result).then((url) => {
          this.image = url;
          this.form.patchValue({ photo: this.image });
        }).catch((error) => {
          console.error('Error uploading image:', error);
        });
      };
    }
  }

  onSubmit() {
    this.formErrorMessage = null;
    this.imageErrorMessage = null;

    const formIsInvalid = this.form.invalid;
    const imageIsMissing = !this.image;

    if (formIsInvalid || imageIsMissing) {
      if (formIsInvalid) {
        this.formErrorMessage = 'Por favor, completa todos los campos requeridos.';
        this.form.markAllAsTouched();
      }
      if (imageIsMissing) {
        this.imageErrorMessage = 'Por favor, sube una imagen de perfil.';
      }

      return;
    }

    const signUpRequest = new SignUpRequest(this.form.value.username, this.form.value.password);
    const signInInfo: SignInInfo = new SignInInfo(
      this.form.value.firstName,

      this.form.value.lastName,
      this.form.value.phoneNumber,
      this.image!,
      this.form.value.email
    );
    console.log(signInInfo)

    this.authenticationService.signUp(signUpRequest, signInInfo);
    this.submitted = true;
    this.submitted = true;

    if (this.form.invalid || !this.image) return;
  }

}
