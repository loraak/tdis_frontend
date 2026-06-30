import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgresoAlumno } from './progreso-alumno';

describe('ProgresoAlumno', () => {
  let component: ProgresoAlumno;
  let fixture: ComponentFixture<ProgresoAlumno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgresoAlumno]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgresoAlumno);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
