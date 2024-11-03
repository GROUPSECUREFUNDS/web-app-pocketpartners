import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { GroupMembersService } from '../../services/group-members.service';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../../../shared/services/storage.service';
import { GroupEntity } from '../../model/group.entity';
import { AuthenticationService } from '../../../iam/services/authentication.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-group-config',
  templateUrl: './group-config.component.html',
  styleUrls: ['./group-config.component.css'],
})
export class GroupConfigComponent implements OnInit {
  group = signal<GroupEntity | null>(null);
  members = signal<any[]>([]);
  invitationToken = signal<string | null>(null);

  newImageBase64: string | null = null;
  isLoadingText: boolean = false;
  isLoadingImage: boolean = false;
  isLoadingMembers: boolean = false;
  message: string | null = null;
  selectedFileName: string = ''; 
  currentUserId!: number;
  isTokenCopied: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private groupMembersService: GroupMembersService,
    private storageService: StorageService,
    private authService: AuthenticationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const groupId = +params['id'];
      this.loadGroupData(groupId);
    });
    this.authService.currentUserId.subscribe((userId: any) => {
      this.currentUserId = userId;
    });
  }

  loadGroupData(groupId: number) {
    this.groupService.getById(groupId).subscribe((data) => {
      this.group.set(data);
    });

    this.groupService.getAllMembersByIdGroup(groupId).subscribe((data) => {
      this.members.set(data);
    });
  }



  async updateGroupImage(imageBase64: string) {
    const group = this.group();
    if (group) {
      this.isLoadingImage = true;
      this.message = null;
      const imageUrl = await this.storageService.uploadFile(`group_${group.id}`, imageBase64);

      if (imageUrl) {
        this.groupService.updateGroupImage(group.id, imageUrl).subscribe(
          (updatedGroup) => {
            this.group.set(updatedGroup); 
            this.message = 'Imagen del grupo actualizada exitosamente.';
            this.isLoadingImage = false;
          },
          () => {
            this.message = 'Error al actualizar la imagen del grupo.';
            this.isLoadingImage = false;
          }
        );
      } else {
        this.message = 'Error al cargar la imagen en el almacenamiento.';
        this.isLoadingImage = false;
      }
    }
  }

  onImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFileName = file.name; 
      const reader = new FileReader();
      reader.onload = () => {
        this.newImageBase64 = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  saveTextChanges() {
    const group = this.group();
    if (group) {
      this.isLoadingText = true;
      this.message = null;
      this.groupService.updateGroup(group.id, group.name, group.description).subscribe(
        () => {
          this.message = 'Nombre y descripción actualizados exitosamente.';
          this.isLoadingText = false;
          this.loadGroupData(group.id); 
        },
        () => {
          this.message = 'Error al actualizar el nombre y descripción.';
          this.isLoadingText = false;
        }
      );
    }
  }

  generateToken() {
    const group = this.group();
    if (group) {
      this.groupService.generateInvitation(group.id).subscribe(token => {
        this.invitationToken.set(token);
      });
    }
  }

  copyToken() {
    const token = this.invitationToken();
    if (token) {
      navigator.clipboard.writeText(token).then(() => {
        this.isTokenCopied = true;  
        setTimeout(() => {
          this.isTokenCopied = false;  
        }, 2000);
      }).catch(() => {
        console.error('Error al copiar el token.');
      });
    }
  }


  deleteMember(userId: number) {
    const group = this.group();
    if (group) {
      this.isLoadingMembers = true; 
      this.groupMembersService.deleteGroupMember(group.id, userId).subscribe({
        next: () => {
          console.log('Miembros antes de eliminar:', this.members());
          this.members.update(members => members.filter(member => member.userId !== userId));
          console.log('Miembros después de eliminar:', this.members());
          this.loadGroupData(group.id);
          this.isLoadingMembers = false; 
          console.log('Miembro eliminado exitosamente.');
        },
        error: () => {
          this.message = 'Error al eliminar miembro.';
          this.isLoadingMembers = false;
          console.log('Miembro no eliminado exitosamente.');
        }
      });
    }

  }


}
