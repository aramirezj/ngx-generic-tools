import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderMaestroComponent } from './slider-maestro.component';

describe('SliderMaestroComponent', () => {
  let component: SliderMaestroComponent;
  let fixture: ComponentFixture<SliderMaestroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SliderMaestroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderMaestroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
