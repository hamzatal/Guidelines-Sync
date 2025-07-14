<?php

namespace App\Http\Controllers\AdminAuth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Contact;
use App\Models\Company;
use App\Models\HeroSection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Facades\Schema;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            $admin = Auth::guard('admin')->user();

            // Initialize stats with default values
            $stats = [
                'users' => 0,
                'deactivated_users' => 0,
                'companies' => 0,
                'active_companies' => 0,
                'deactivated_companies' => 0,
                'messages' => 0,
                'unread_messages' => 0,
                'hero_sections' => 0,
            ];

            // Check if tables exist before querying
            if (Schema::hasTable('users')) {
                $stats['users'] = User::count();
                $stats['deactivated_users'] = User::where('is_active', 0)->count();
            }

            if (Schema::hasTable('companies')) {
                $stats['companies'] = Company::count();
                $stats['active_companies'] = Company::where('is_active', 1)->count();
                $stats['deactivated_companies'] = Company::where('is_active', 0)->count();
            }

            if (Schema::hasTable('contacts')) {
                $stats['messages'] = Contact::count();
                $stats['unread_messages'] = Contact::where('is_read', false)->count();
            }

            if (Schema::hasTable('hero_sections')) {
                $stats['hero_sections'] = HeroSection::count();
            }

            // Fetch latest users (if table exists)
            $latestUsers = Schema::hasTable('users')
                ? User::select('id', 'name', 'email', 'created_at')
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get()
                : [];

            // Fetch latest messages (if table exists)
            $latestMessages = Schema::hasTable('contacts')
                ? Contact::select('id', 'name', 'email', 'subject', 'message', 'is_read', 'created_at')
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get()
                : [];

            return Inertia::render('Admin/Dashboard', [
                'admin' => [
                    'id' => $admin->id,
                    'name' => $admin->name,
                    'email' => $admin->email,
                    'avatar' => $admin->avatar ?? null,
                ],
                'stats' => $stats,
                'latest_users' => $latestUsers,
                'latest_messages' => $latestMessages,
                'flash' => [
                    'success' => session('success'),
                    'error' => session('error'),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to load admin dashboard:', ['error' => $e->getMessage()]);
            return Inertia::render('Admin/Dashboard', [
                'admin' => [
                    'id' => $admin->id ?? null,
                    'name' => $admin->name ?? 'Admin',
                    'email' => $admin->email ?? 'admin@example.com',
                    'avatar' => null,
                ],
                'stats' => [
                    'users' => 0,
                    'deactivated_users' => 0,
                    'companies' => 0,
                    'active_companies' => 0,
                    'deactivated_companies' => 0,
                    'messages' => 0,
                    'unread_messages' => 0,
                    'hero_sections' => 0,
                ],
                'latest_users' => [],
                'latest_messages' => [],
                'flash' => [
                    'success' => null,
                    'error' => 'Failed to load dashboard data.',
                ],
            ]);
        }
    }
}
