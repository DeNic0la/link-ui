import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface SecureLinkRequest {
  accessKey: string;
  targetLink: string;
  secondFactorKey: string;
}

export interface SecureLinkResponse {
  accessKey: string;
  secondFactorKeyRaw: string;
  secondFactorKeyHashed: string;
  targetLink: string;
  accessLink: string;
}

@Injectable({
  providedIn: 'root',
})
export class SecureLinkService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/secured/';

  registerSecureLink(request: SecureLinkRequest): Observable<SecureLinkResponse> {
    return this.http.post<SecureLinkResponse>(this.apiUrl, request);
  }
}
