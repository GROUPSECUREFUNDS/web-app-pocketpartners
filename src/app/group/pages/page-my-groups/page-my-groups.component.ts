import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { GroupEntity } from '../../model/group.entity';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../iam/services/authentication.service';
import { MatDialog } from "@angular/material/dialog";
import { GroupJoinDialogComponent } from "../../components/group-join-dialog/group-join-dialog.component";

@Component({
  selector: 'app-page-my-groups',
  templateUrl: './page-my-groups.component.html',
  styleUrls: ['./page-my-groups.component.css']
})
export class PageMyGroupsComponent implements OnInit {
  public groups: GroupEntity[] = [];
  public searchTerm: string = '';
  currentUserId: number = 0;
  isDataLoaded: Promise<boolean> = new Promise((resolve) => resolve(false));
  constructor(
    private groupService: GroupService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private dialog: MatDialog
  ) { }

  getUserGroups() {
    this.isDataLoaded.finally(() => {
      this.isDataLoaded = new Promise((resolve) => resolve(false));
    });

    this.groupService.getAllGroupsByUserId(this.currentUserId).subscribe((groups: any[]) => {
      this.groups = groups.map(group => ({
        ...group,
        isMember: true
      }));

      this.isDataLoaded.finally(() => {
        this.isDataLoaded = new Promise((resolve) => resolve(true));
      });
    });
  }



  filteredGroups() {
    return this.groups.filter(group =>
      group.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openGroup(id: number) {
    this.router.navigate(['/group-detail', id]);
  }

  ngOnInit() {
    this.authenticationService.currentUserId.subscribe((userId: any) => {
      this.currentUserId = userId;
      this.getUserGroups();
    });
  }

}
