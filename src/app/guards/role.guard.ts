import { CanActivateFn, Router } from "@angular/router";
import { AuthApiService } from "../services/auth.service";
import { inject } from "@angular/core";

export const roleGuard: CanActivateFn = (route) => {

  const auth = inject(AuthApiService);
  const router = inject(Router);

  const role = auth.getRole();

  const allowedRoles =
    route.data?.['roles'] ?? [];

  if (allowedRoles.includes(role)) {
    return true;
  }

  return router.createUrlTree(['/unauthorized']);
};