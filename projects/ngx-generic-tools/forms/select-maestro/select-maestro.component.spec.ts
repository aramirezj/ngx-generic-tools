import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GTSelectMaestroComponent } from './select-maestro.component';

describe('GTSelectMaestroComponent', () => {
  let component: GTSelectMaestroComponent;
  let fixture: ComponentFixture<GTSelectMaestroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GTSelectMaestroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GTSelectMaestroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
