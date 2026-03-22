import { inject } from '@angular/core';
import { UserService } from '../services/users.service';
import { Router } from '@angular/router';

export const AuthGuard = () => {
    const userService = inject(UserService);
    const router = inject(Router);

    if (userService.isAuthenticated())
      return true;

    router.navigate(['']);
      return false;

}
