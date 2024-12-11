// import { Injectable } from '@angular/core';
// import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import {LocalStorageService} from './local.storage.service';
//
// @Injectable()
// export class TokenInterceptor implements HttpInterceptor {
//
//   constructor(private localStorageService: LocalStorageService) { }
//
//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     // Get the token from local storage or another service
//     const token = this.localStorageService.getToken('authToken');
//
//     // Clone the request to add the authorization header
//     let clonedReq = req;
//
//     if (token) {
//       clonedReq = req.clone({
//         setHeaders: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//     }
//
//     // Pass the cloned request instead of the original request to the next handler
//     return next.handle(clonedReq);
//   }
// }
