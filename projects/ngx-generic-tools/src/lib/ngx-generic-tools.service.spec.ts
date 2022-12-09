import { TestBed } from '@angular/core/testing';

import { NgxGenericToolsService } from './ngx-generic-tools.service';

describe('NgxGenericToolsService', () => {
  let service: NgxGenericToolsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxGenericToolsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
