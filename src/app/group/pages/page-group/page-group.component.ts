import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { GroupEntity } from '../../model/group.entity';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../iam/services/authentication.service';
import {MatDialog} from "@angular/material/dialog";
import {GroupJoinDialogComponent} from "../../components/group-join-dialog/group-join-dialog.component";

@Component({
  selector: 'app-page-group',
  templateUrl: './page-group.component.html',
  styleUrl: './page-group.component.css'
})
export class PageGroupComponent implements OnInit {
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

  getAllGroups() {
    this.isDataLoaded.finally(() => {
      this.isDataLoaded = new Promise((resolve) => resolve(false));
    });
    this.groupService.getAll()
      .subscribe((groups: any) => {
        this.groups = groups;
        this.isDataLoaded.finally(() => {
          this.isDataLoaded = new Promise((resolve) => resolve(true));
        });
        this.groups.forEach(group => {
          this.groupService.getAllMembersByIdGroup(group.id).subscribe
          ((members: any) => {
            group.members = members;

            if (group.members.some(member => member.userId === this.currentUserId)) {
              group.isMember = true;
            } else {
              group.isMember = false;
            }
            console.log("The group: ", group);
          });
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

  joinGroup(groupId: number) {
    const dialogRef = this.dialog.open(GroupJoinDialogComponent, {
      width: '300px',
      data: { groupId }
    });

    dialogRef.afterClosed().subscribe((invitationToken) => {
      if (invitationToken) {
        console.log("Joining group with token: ", invitationToken);
        this.groupService.joinGroupWithToken(groupId, this.currentUserId, invitationToken).subscribe(
          (response: any) => {
            console.log("Successfully joined the group");
            this.openGroup(groupId);
          },
          (error: any) => {
            console.error("Failed to join the group:", error);
            alert("Invalid invitation token.");
          }
        );
      }
    });
  }

  ngOnInit() {
    this.authenticationService.currentUserId.subscribe((userId: any) => {
      this.currentUserId = userId;
      this.getAllGroups();
    });
  }

}
