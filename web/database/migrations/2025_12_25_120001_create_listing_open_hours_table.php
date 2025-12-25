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
        Schema::create('listing_open_hours', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('listing_id');
            // 0 = Sunday .. 6 = Saturday (Carbon::dayOfWeek)
            $table->tinyInteger('day_of_week')->unsigned();
            $table->time('start_time');
            $table->time('end_time');
            $table->timestamps();

            $table->foreign('listing_id')->references('id')->on('apartments')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listing_open_hours');
    }
};
