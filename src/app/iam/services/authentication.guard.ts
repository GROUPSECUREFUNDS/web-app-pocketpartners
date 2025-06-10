import { CanActivateFn, Router } from '@angular/router';
import { map, take } from "rxjs";
import { AuthenticationService } from "./authentication.service";
import { inject } from "@angular/core";

export const authenticationGuard: CanActivateFn = () => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);
  return authenticationService.isSignedIn.pipe(
    take(1), map(isSignedIn => {
      if (isSignedIn) {
        return true;
      } else {
        router.navigate(['/sign-in']).then();
        return false;
      }
    })
  );
};

export const noAuthGuard: CanActivateFn = () => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);
  return authenticationService.isSignedIn.pipe(
    take(1), map(isSignedIn => {
      if (isSignedIn) {
        router.navigate(['/home']).then();
        return false;
      } else {

        return true;
      }
    })
  );
};

