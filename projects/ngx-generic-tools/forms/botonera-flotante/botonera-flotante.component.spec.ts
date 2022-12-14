import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotoneraFlotanteComponent } from './botonera-flotante.component';

describe('BotoneraFlotanteComponent', () => {
  let component: BotoneraFlotanteComponent;
  let fixture: ComponentFixture<BotoneraFlotanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BotoneraFlotanteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BotoneraFlotanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
