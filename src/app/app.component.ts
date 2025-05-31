import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { Router } from '@angular/router';
import { AuthenticationService } from './iam/services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'PocketPartners';
  options = [
    { path: '/home', title: 'Home' },
    { path: '/groups', title: 'Groups' },
    { path: '/profile', title: 'Profile' },
    { path: '/incoming', title: 'Incoming payments' },
    { path: '/outgoing', title: 'Outgoing  payments' },
    { path: '/expenses', title: 'Expenses' },
  ];

  isAuth = false;
  currentUsername: string = '';
  currentId: number = 0;
  constructor(translate: TranslateService, public router: Router, private authenticationService: AuthenticationService) {
    translate.setDefaultLang('en');
    translate.use('en');
  }
  ngAfterViewInit(): void {
    this.authenticationService.isSignedIn.subscribe(
      (isAuth: any) => {
        this.isAuth = isAuth;
      }
    );
  }

  ngOnInit() {
  }
}
