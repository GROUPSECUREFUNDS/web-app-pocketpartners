import { Component } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { GroupEntity } from '../../model/group.entity';
import { Router } from '@angular/router';
import { GroupMembersService } from '../../services/group-members.service';
import { AuthenticationService } from '../../../iam/services/authentication.service';

@Component({
  selector: 'app-page-create-group',
  templateUrl: './page-create-group.component.html',
  styleUrl: './page-create-group.component.css'
})
export class PageCreateGroupComponent {
  constructor(private groupService: GroupService, private groupMembersService: GroupMembersService, private router: Router, private authenticationService: AuthenticationService) { }
  userId: number = 0;

  ngOnInit() {
    this.authenticationService.currentUserId.subscribe((userId: any) => {
      this.userId = userId;
    });
  }

  createNewGroup(group: GroupEntity) {
    if (this.userId) {
      this.groupService.createGroup(group.name, group.groupPhoto, group.description, this.userId)
        .subscribe({
          next: () => {
            this.redirectToGroupList();
          },
          error: () => {
            console.error("Error al crear el grupo:");
          }
        });
    } else {
      console.error("Error: userId no está disponible.");
    }
  }


  redirectToGroupList() {
    this.router.navigate(['/groups']);
  }
}
