import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageMyGroupsComponent } from './page-my-groups.component';

describe('PageMyGroupsComponent', () => {
  let component: PageMyGroupsComponent;
  let fixture: ComponentFixture<PageMyGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageMyGroupsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageMyGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
