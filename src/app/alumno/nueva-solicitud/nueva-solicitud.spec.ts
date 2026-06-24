import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaSolicitud } from './nueva-solicitud';

describe('NuevaSolicitud', () => {
  let component: NuevaSolicitud;
  let fixture: ComponentFixture<NuevaSolicitud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevaSolicitud]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevaSolicitud);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
