import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterInternComponent } from './register-intern.component';

describe('RegisterInternComponent', () => {
  let component: RegisterInternComponent;
  let fixture: ComponentFixture<RegisterInternComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterInternComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterInternComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
