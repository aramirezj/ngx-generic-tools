import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GTChipsComponent } from './chips.component';

describe('GTChipsComponent', () => {
  let component: GTChipsComponent;
  let fixture: ComponentFixture<GTChipsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GTChipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GTChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
