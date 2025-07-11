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
  isDataLoading: boolean = false;
  constructor(
    private groupService: GroupService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private dialog: MatDialog
  ) { }

  getUserGroups() {

    this.groupService.getAllGroupsByUserId(this.currentUserId).subscribe({
      next: (groups: GroupEntity[]) => {
        this.groups = groups.map((group)=>{
          return {...group, isMember:true};
        });
        this.isDataLoading = false;
      },
      error: (error) => {
        console.error('Error fetching user groups:', error);
        this.groups = [];
        this.isDataLoading = false;
      }
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
