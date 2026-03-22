import { HttpInterceptorFn } from "@angular/common/http";

export const allInterceptor: HttpInterceptorFn = (req, next) => {

  req = req.clone({
    setHeaders: {
      "X-Api-Key":"e17bb89d-516b-4d23-9e44-3b17b31668e1"
    }
  });

  return next(req);
}
