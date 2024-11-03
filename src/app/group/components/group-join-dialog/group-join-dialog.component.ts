import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-group-join-dialog',
  templateUrl: './group-join-dialog.component.html',
})
export class GroupJoinDialogComponent {
  invitationToken: string = '';

  constructor(
    public dialogRef: MatDialogRef<GroupJoinDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onJoin(): void {
    this.dialogRef.close(this.invitationToken);
  }
}
