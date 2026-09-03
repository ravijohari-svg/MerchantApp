import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamLayout } from './team-layout';

describe('TeamLayout', () => {
  let component: TeamLayout;
  let fixture: ComponentFixture<TeamLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
