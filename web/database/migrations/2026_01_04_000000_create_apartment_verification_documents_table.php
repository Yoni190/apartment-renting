<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('apartment_verification_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('apartment_id')->constrained('apartments')->onDelete('cascade');
            $table->enum('document_type', [
                'ownership_certificate',
                'utility_bill',
                'authorization_letter',
                'agent_id',
                'national_id'
            ]);
            $table->string('file_path');
            // created_at is required; timestamps adds created_at and updated_at (updated_at is additive)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('apartment_verification_documents');
    }
};
