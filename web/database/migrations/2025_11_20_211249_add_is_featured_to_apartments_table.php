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
            if (!Schema::hasColumn('apartments', 'is_featured')) {
                $table->tinyInteger('is_featured')->default(0)->after('user_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('apartments', function (Blueprint $table) {
            if (Schema::hasColumn('apartments', 'is_featured')) {
                $table->dropColumn('is_featured');
            }
        });
    }
};
