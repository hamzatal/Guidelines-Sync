<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Journal extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'publisher',
        'category',
        'impact_factor',
        'issn',
        'website',
        'submission_url',
        'font_family',
        'font_size',
        'line_spacing',
        'margin_top',
        'margin_bottom',
        'margin_left',
        'margin_right',
        'citation_style',
        'reference_style',
        'max_pages',
        'abstract_required',
        'keywords_required',
        'custom_guidelines',
        'is_active'
    ];

    protected $casts = [
        'impact_factor' => 'float',
        'abstract_required' => 'boolean',
        'keywords_required' => 'boolean',
        'is_active' => 'boolean',
        'custom_guidelines' => 'array',
    ];
}
