import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GTConfirmacionComponent } from './confirmacion.component';

describe('GTConfirmacionComponent', () => {
  let component: GTConfirmacionComponent;
  let fixture: ComponentFixture<GTConfirmacionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GTConfirmacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GTConfirmacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
