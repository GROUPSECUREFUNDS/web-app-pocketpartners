import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GroupEntity } from '../../model/group.entity';
import { GroupMembersService } from '../../services/group-members.service';
import { AuthenticationService } from '../../../iam/services/authentication.service';
import { GroupService } from '../../services/group.service';
import { StorageService } from "../../../shared/services/storage.service";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-form-create-group',
  templateUrl: './form-create-group.component.html',
  styleUrls: ['./form-create-group.component.css']
})
export class FormCreateGroupComponent implements OnInit {

  groupMembers = new FormControl();
  groupMembersList: any[] = [];
  form!: FormGroup;
  submitted = false;
  image: string | null = null;
  selectedFileName: string = '';
  formErrorMessage: string | null = null;
  imageErrorMessage: string | null = null;
  previewImageUrl: string | ArrayBuffer | null = null;

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
    secondCtrl: ['', Validators.required]
  });
  secondFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    description: ['', Validators.required],
  });
  isLinear = false;

  @Output() createGroup: EventEmitter<GroupEntity> = new EventEmitter<GroupEntity>();

  private group: GroupEntity = new GroupEntity();
  currentUserId: number = 0;

  stepperOrientation: 'horizontal' | 'vertical' = 'horizontal';

  constructor(
    private _formBuilder: FormBuilder,
    private groupMember: GroupMembersService,
    private storageService: StorageService,
    private groupService: GroupService,
    private authenticationService: AuthenticationService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.stepperOrientation = result.matches ? 'vertical' : 'horizontal';
      });

    this.authenticationService.currentUserId.subscribe((userId: any) => {
      this.currentUserId = userId;
    });
    this.groupService.getAllMembersByIdGroup(this.group.id).subscribe((partners: any) => {
      partners.forEach((partner: any) => {
        if (partner.userId !== this.currentUserId) {
          this.groupMembersList.push({ name: partner.fullName, id: partner.userId });
        }
      });
    });
  }

  onChanges(): void {
    this.firstFormGroup.valueChanges.subscribe(val => {});
  }

  uploadImagegroup(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.selectedFileName = file.name;
      let reader = new FileReader();
      let name = "GROUP_IMAGE_" + Date.now();

      reader.readAsDataURL(file);
      reader.onloadend = () => {
        this.previewImageUrl = reader.result;
        this.storageService.uploadimagegroup(name, reader.result).then((url) => {
          this.image = url;
          this.firstFormGroup.get('secondCtrl')?.setValue(this.image);
        }).catch((error) => {
          console.error('Error uploading image:', error);
        });
      };
    }
  }

  createNewGroup() {
    this.group.name = this.firstFormGroup.get('firstCtrl')?.value as string;
    this.group.groupPhoto = this.firstFormGroup.get('secondCtrl')?.value as string;
    this.group.adminId = this.currentUserId;
    this.group.description = this.thirdFormGroup.get('description')?.value as string;
    this.createGroup.emit(this.group);
  }
}
