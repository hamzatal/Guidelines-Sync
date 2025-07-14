<?php

namespace App\Http\Controllers;

use App\Models\HeroSection;
use App\Models\Offer;
use App\Models\Destination;
use App\Models\Package;
use App\Models\Favorite;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    public function index()
    {
        $userId = Auth::guard('web')->check() ? Auth::guard('web')->id() : null;
        $heroSections = HeroSection::select(['id', 'title', 'subtitle', 'image'])
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($hero) {
                $hero->image = $hero->image ? Storage::url($hero->image) : null;
                return $hero;
            });
        return Inertia::render('Home', [
            'heroSections' => $heroSections,


        ]);
    }
}
