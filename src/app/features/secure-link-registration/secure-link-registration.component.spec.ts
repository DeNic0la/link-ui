import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { SecureLinkService } from '../../core/secure-link.service';
import { SecureLinkRegistrationComponent } from './secure-link-registration.component';

describe('SecureLinkRegistrationComponent', () => {
  let component: SecureLinkRegistrationComponent;
  let fixture: ComponentFixture<SecureLinkRegistrationComponent>;
  let secureLinkServiceSpy: { registerSecureLink: any };

  beforeEach(async () => {
    secureLinkServiceSpy = {
      registerSecureLink: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [SecureLinkRegistrationComponent, ReactiveFormsModule],
      providers: [{ provide: SecureLinkService, useValue: secureLinkServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(SecureLinkRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('should validate targetLink format', () => {
    const targetLink = component.form.controls.targetLink;
    targetLink.setValue('invalid-url');
    expect(targetLink.hasError('pattern')).toBeTruthy();

    targetLink.setValue('https://example.com');
    expect(targetLink.hasError('pattern')).toBeFalsy();
  });

  it('should call registerSecureLink on submit when form is valid', () => {
    const dummyResponse = {
      accessKey: 'test-02',
      secondFactorKeyRaw: '123456',
      secondFactorKeyHashed: 'hashed',
      targetLink: 'https://example.com',
      accessLink: 'http://localhost:8080/api/secured/test-02',
    };

    secureLinkServiceSpy.registerSecureLink.mockReturnValue(of(dummyResponse));

    component.form.setValue({
      accessKey: 'test-02',
      targetLink: 'https://example.com',
      secondFactorKey: '123456',
    });

    component.onSubmit();

    expect(secureLinkServiceSpy.registerSecureLink).toHaveBeenCalledWith({
      accessKey: 'test-02',
      targetLink: 'https://example.com',
      secondFactorKey: '123456',
    });
    expect(component.result()).toEqual(dummyResponse);
    expect(component.loading()).toBeFalsy();
  });

  it('should set error signal on registration failure', () => {
    secureLinkServiceSpy.registerSecureLink.mockReturnValue(throwError(() => new Error('Error')));

    component.form.setValue({
      accessKey: 'test-02',
      targetLink: 'https://example.com',
      secondFactorKey: '123456',
    });

    component.onSubmit();

    expect(component.error()).toBe(
      'Sicherer Link konnte nicht erstellt werden. Bitte versuchen Sie es erneut.',
    );
    expect(component.loading()).toBeFalsy();
  });
});
