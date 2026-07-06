import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesPrevias } from './solicitudes-previas';

describe('SolicitudesPrevias', () => {
  let component: SolicitudesPrevias;
  let fixture: ComponentFixture<SolicitudesPrevias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudesPrevias]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudesPrevias);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
