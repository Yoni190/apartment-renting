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
        // Add column only if it does not already exist (prevents duplicate column errors)
        if (!Schema::hasColumn('apartments', 'verified_at')) {
            Schema::table('apartments', function (Blueprint $table) {
                $table->timestamp('verified_at')->nullable();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('apartments', 'verified_at')) {
            Schema::table('apartments', function (Blueprint $table) {
                $table->dropColumn('verified_at');
            });
        }
    }
};
