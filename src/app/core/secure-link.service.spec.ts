import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SecureLinkRequest, SecureLinkService } from './secure-link.service';

describe('SecureLinkService', () => {
  let service: SecureLinkService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SecureLinkService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SecureLinkService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request to register a secure link', () => {
    const dummyRequest: SecureLinkRequest = {
      accessKey: 'test-key',
      targetLink: 'https://example.com',
      secondFactorKey: '123456',
    };

    const dummyResponse = {
      accessKey: 'test-key',
      secondFactorKeyRaw: '123456',
      secondFactorKeyHashed: 'hashed-key',
      targetLink: 'https://example.com',
      accessLink: 'http://localhost:8080/api/secured/test-key',
    };

    service.registerSecureLink(dummyRequest).subscribe((res) => {
      expect(res).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne('/api/secured/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dummyRequest);
    req.flush(dummyResponse);
  });
});
