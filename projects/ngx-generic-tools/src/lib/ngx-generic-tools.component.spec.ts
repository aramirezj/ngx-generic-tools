import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxGenericToolsComponent } from './ngx-generic-tools.component';

describe('NgxGenericToolsComponent', () => {
  let component: NgxGenericToolsComponent;
  let fixture: ComponentFixture<NgxGenericToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxGenericToolsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxGenericToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
