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
        Schema::table('apartments', function (Blueprint $table) {
            if (!Schema::hasColumn('apartments', 'rejection_reason')) {
                $table->longText('rejection_reason')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('apartments', function (Blueprint $table) {
            if (Schema::hasColumn('apartments', 'rejection_reason')) {
                $table->dropColumn('rejection_reason');
            }
        });
    }
};
