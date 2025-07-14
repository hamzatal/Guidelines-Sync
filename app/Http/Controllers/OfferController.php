<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use App\Models\Favorite;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class OfferController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        return Inertia::render('Offers/Index', [
      
            'auth' => Auth::check() ? ['user' => Auth::user()] : null,
            'flash' => session()->only(['success', 'error']),
        ]);
    }


}
