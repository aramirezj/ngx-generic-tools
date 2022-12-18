import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GTElementoTablaComponent } from './elemento-tabla.component';

describe('GTElementoTablaComponent', () => {
  let component: GTElementoTablaComponent;
  let fixture: ComponentFixture<GTElementoTablaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GTElementoTablaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GTElementoTablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
