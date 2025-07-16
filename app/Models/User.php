<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'code',
        'email_verified_at',
        'avatar',
        'bio',
        'is_active',
        'deactivated_at',
        'deactivation_reason',
        'remember_token',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'code',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'deactivated_at' => 'datetime',
        'is_active' => 'boolean',
    ];
}
