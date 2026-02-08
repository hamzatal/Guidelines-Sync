<?php

namespace App\Http\Middleware;

use App\Providers\RouteServiceProvider;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$guards): Response
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                $redirectTo = $this->getRedirectPath($guard);
                return redirect($redirectTo);
            }
        }

        return $next($request);
    }

    /**
     * Get the redirect path based on guard
     */
    protected function getRedirectPath(?string $guard): string
    {
        return match($guard) {
            'admin' => '/admin/dashboard',
            'company' => '/company/dashboard',
            'web', null => '/home', 
            default => RouteServiceProvider::HOME,
        };
    }
}