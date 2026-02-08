<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\Auth;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => Auth::guard('web')->check() ? [
                    'id' => Auth::guard('web')->user()->id,
                    'name' => Auth::guard('web')->user()->name,
                    'email' => Auth::guard('web')->user()->email,
                    'avatar_url' => Auth::guard('web')->user()->avatar_url ?? null,
                    'bio' => Auth::guard('web')->user()->bio ?? null,
                    'phone' => Auth::guard('web')->user()->phone ?? null,
                    'created_at' => Auth::guard('web')->user()->created_at,
                ] : null,
                'admin' => Auth::guard('admin')->check() ? [
                    'id' => Auth::guard('admin')->user()->id,
                    'name' => Auth::guard('admin')->user()->name,
                    'email' => Auth::guard('admin')->user()->email,
                    'created_at' => Auth::guard('admin')->user()->created_at,
                ] : null,
                'company' => Auth::guard('company')->check() ? [
                    'id' => Auth::guard('company')->user()->id,
                    'name' => Auth::guard('company')->user()->name,
                    'email' => Auth::guard('company')->user()->email,
                    'company_name' => Auth::guard('company')->user()->company_name,
                    'created_at' => Auth::guard('company')->user()->created_at,
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'errors' => $request->session()->get('errors')
                ? $request->session()->get('errors')->getBag('default')->getMessages()
                : [],
        ]);
    }
}