import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisionActividad } from './revision-actividad';

describe('RevisionActividad', () => {
  let component: RevisionActividad;
  let fixture: ComponentFixture<RevisionActividad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevisionActividad]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevisionActividad);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
