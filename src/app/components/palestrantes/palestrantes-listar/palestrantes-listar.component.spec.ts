/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PalestrantesListarComponent } from './palestrantes-listar.component';

describe('PalestrantesListarComponent', () => {
  let component: PalestrantesListarComponent;
  let fixture: ComponentFixture<PalestrantesListarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PalestrantesListarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PalestrantesListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
