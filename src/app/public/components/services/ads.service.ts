import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AdsService {
  private adsUrl = environment.imgURL; // Use baseURL from environment config

  constructor(private http: HttpClient) {}

  getAds(): Observable<{ url: string }[]> {
    return this.http.get<{ url: string }[]>(this.adsUrl);
  }
}

