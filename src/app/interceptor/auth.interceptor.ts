import {
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';

import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);

  const token = localStorage.getItem('token');

  let authReq = req;

  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {

      switch (error.status) {

        case 401:
          // localStorage.clear();
          // router.navigate(['/login']);
          break;

        case 403:
          router.navigate(['/unauthorized']);
          break;

        case 500:
          console.error('Internal Server Error');
          break;

        default:
          console.error(error.message);
      }

      return throwError(() => error);
    })
  );
};