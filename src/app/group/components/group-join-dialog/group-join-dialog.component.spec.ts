import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupJoinDialogComponent } from './group-join-dialog.component';

describe('GroupJoinDialogComponent', () => {
  let component: GroupJoinDialogComponent;
  let fixture: ComponentFixture<GroupJoinDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupJoinDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupJoinDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
