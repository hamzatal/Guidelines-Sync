<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('journals', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('publisher');
            $table->string('category')->nullable();
            $table->decimal('impact_factor', 5, 3)->nullable();
            $table->string('issn')->nullable();
            $table->string('website')->nullable();
            $table->string('submission_url')->nullable();

            // Formatting Guidelines
            $table->string('font_family')->default('Times New Roman');
            $table->integer('font_size')->default(12);
            $table->decimal('line_spacing', 3, 1)->default(1.5);
            $table->decimal('margin_top', 4, 2)->default(2.54);
            $table->decimal('margin_bottom', 4, 2)->default(2.54);
            $table->decimal('margin_left', 4, 2)->default(2.54);
            $table->decimal('margin_right', 4, 2)->default(2.54);
            $table->string('citation_style')->default('APA');
            $table->string('reference_style')->default('APA');
            $table->integer('max_pages')->nullable();
            $table->boolean('abstract_required')->default(true);
            $table->boolean('keywords_required')->default(true);
            $table->json('custom_guidelines')->nullable();

            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('journals');
    }
};
