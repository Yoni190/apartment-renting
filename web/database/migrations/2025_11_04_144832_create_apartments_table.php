<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('apartments', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->decimal('price', 10,2);
            $table->tinyInteger('status')->default(1);
            $table->string('address');
            $table->tinyInteger('bedrooms')->default(1);
            $table->tinyInteger('bathrooms')->default(1);
            $table->integer('size')->nullable();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->index(['status', 'price', 'user_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('apartments');
    }
};
