import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
    // Skip adding token for auth endpoints
    if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
        return next(req);
    }

    const token = localStorage.getItem('playmatch_token');

    if (token) {
        const cloned = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        return next(cloned);
    }

    return next(req);
};
