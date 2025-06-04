import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { GroupEntity } from '../../model/group.entity';
import { Router } from '@angular/router';
import { GroupMembersService } from '../../services/group-members.service';
import { AuthenticationService } from '../../../iam/services/authentication.service';

@Component({
  selector: 'app-page-create-group',
  templateUrl: './page-create-group.component.html',
  styleUrls: ['./page-create-group.component.css']
})
export class PageCreateGroupComponent implements OnInit {
  userId: number = 0;

  constructor(
    private groupService: GroupService,
    private groupMembersService: GroupMembersService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.authenticationService.currentUserId.subscribe((userId: any) => {
      this.userId = userId;
    });
  }

  // Recibe solo los datos mínimos desde el formulario
  createNewGroup(partialGroup: Partial<GroupEntity>): void {
    if (this.userId) {
      const group: GroupEntity = {
        id: 0, // se asigna en backend
        name: partialGroup.name ?? '',
        groupPhoto: partialGroup.groupPhoto ?? 'assets/images/default-user.png',
        description: partialGroup.description ?? '',
        adminId: this.userId,
        members: [],
        isMember: true,
        createdAt: new Date(),
        expenseHistory: [],    // <-- agregamos la propiedad requerida
        paymentHistory: []     // <-- agregamos la propiedad requerida
      };

      this.groupService.createGroup(
        group.name,
        group.groupPhoto,
        group.description,
        this.userId
      ).subscribe({
        next: () => {
          this.redirectToGroupList();
        },
        error: (err) => {
          console.error("Error al crear el grupo:", err);
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
