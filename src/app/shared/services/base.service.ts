import { environment } from "../../../environments/environment";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { catchError, Observable, retry, throwError } from "rxjs";

export class BaseService<T> {
  basePath: string = `${environment.baseURL}`;
  resourceEndpoint: string = '/';
  protected token: string | null = null;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }),
  };

  constructor(protected http: HttpClient) {}

  protected buildPath() {
    return this.basePath + this.resourceEndpoint;
  }

  newToken(token: any) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('token', token);
    }
    this.token = token;
    this.httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      ),
    };
  }

  setToken() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      if (token) {
        this.token = token;
        this.httpOptions = {
          headers: new HttpHeaders(
            {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.token}`
            }
          ),
        };
      }
    }
  }


  handleError(error: HttpErrorResponse) {

    if (error.error instanceof ErrorEvent) {
      console.error(`An error occurred ${error.error.message}`);
    } else {

      console.error(`Backend returned code ${error.status}, body was ${error.error}`);
    }
    return throwError(() => new Error('Something happened with request, please try again later'));
  }


  create(item: any): Observable<T> {
    return this.http.post<T>(this.resourcePath(), JSON.stringify(item), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }


  delete(id: any) {
    return this.http.delete(`${this.resourcePath()}/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }


  update(id: any, item: any): Observable<T> {
    return this.http.put<T>(`${this.resourcePath()}/${id}`, JSON.stringify(item), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }


  getAll(): Observable<T> {
    return this.http.get<T>(this.resourcePath(), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  protected resourcePath(): string {
    return `${this.basePath}${this.resourceEndpoint}`;
  }
}
