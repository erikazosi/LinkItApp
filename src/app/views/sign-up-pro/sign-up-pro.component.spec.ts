import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpProComponent } from './sign-up-pro.component';

describe('SignUpProComponent', () => {
  let component: SignUpProComponent;
  let fixture: ComponentFixture<SignUpProComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpProComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
