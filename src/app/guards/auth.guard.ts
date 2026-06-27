import { inject } from "@angular/core";
import { AuthApiService } from "../services/auth.service";
import { CanActivateFn, Router } from "@angular/router";

export const authGuard: CanActivateFn = () => {

  const auth = inject(AuthApiService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};