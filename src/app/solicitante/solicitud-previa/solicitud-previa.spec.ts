import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudPrevia } from './solicitud-previa';

describe('SolicitudPrevia', () => {
  let component: SolicitudPrevia;
  let fixture: ComponentFixture<SolicitudPrevia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudPrevia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudPrevia);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
