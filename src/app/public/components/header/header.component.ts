import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatDrawer, MatDrawerContainer } from "@angular/material/sidenav";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { MatListItem, MatNavList } from "@angular/material/list";
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIcon } from "@angular/material/icon";
import { MatAnchor, MatButton, MatIconButton } from "@angular/material/button";
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";
import { AuthenticationService } from '../../../iam/services/authentication.service';
import { TranslateModule } from '@ngx-translate/core';
import {DarkModeSwitcherComponent} from "../dark-mode-switcher/dark-mode-switcher.component";
import {AdvertisementComponent} from "../advertisement/advertisement.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatDrawerContainer,
    RouterOutlet,
    MatNavList,
    MatListItem,
    RouterLink,
    RouterLinkActive,
    MatDrawer,
    MatIcon,
    MatButton,
    MatSidenavModule,
    MatMenuTrigger,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatAnchor,
    TranslateModule,
    DarkModeSwitcherComponent,
    AdvertisementComponent,
    CommonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  currentUsername: any = '';
  currentId: any = 0;
  constructor(private authenticationService: AuthenticationService) {
  }
  ngOnInit() {
    this.currentUsername = this.authenticationService.currentUsername;
    this.currentId = this.authenticationService.currentUserId;
  }

  logout() {
    this.authenticationService.signOut();
  }
}
