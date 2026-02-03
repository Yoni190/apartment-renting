<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->boolean('sender_deleted')->default(false)->after('read_at');
            $table->boolean('receiver_deleted')->default(false)->after('sender_deleted');
        });
    }

    public function down()
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->dropColumn(['sender_deleted', 'receiver_deleted']);
        });
    }
};
