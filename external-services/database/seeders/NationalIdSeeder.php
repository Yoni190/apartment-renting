<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\NationalId;

class NationalIdSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        NationalId::insert([
            [
                'national_id' => '00000001',
                'first_name' => 'Yonatan',
                'last_name' => 'Adhanom',
                'date_of_birth' => '2004-03-28',
                'is_active' => true
            ]
            ]);
    }
}
