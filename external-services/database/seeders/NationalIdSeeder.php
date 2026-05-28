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
            ],
            [
                'national_id' => '00000002',
                'first_name' => 'Abebe',
                'last_name' => 'Kebede',
                'date_of_birth' => '1990-05-15',
                'is_active' => true
            ],
            [
                'national_id' => '00000003',
                'first_name' => 'Almaz',
                'last_name' => 'Bekele',
                'date_of_birth' => '1988-11-22',
                'is_active' => true
            ],
            [
                'national_id' => '00000004',
                'first_name' => 'Mekdes',
                'last_name' => 'Tesfaye',
                'date_of_birth' => '1995-07-08',
                'is_active' => true
            ],
            [
                'national_id' => '00000005',
                'first_name' => 'Dawit',
                'last_name' => 'Hailu',
                'date_of_birth' => '1992-03-19',
                'is_active' => true
            ],
            [
                'national_id' => '00000006',
                'first_name' => 'Birtukan',
                'last_name' => 'Lemma',
                'date_of_birth' => '2000-09-04',
                'is_active' => true
            ],
            [
                'national_id' => '00000007',
                'first_name' => 'Tigist',
                'last_name' => 'Getachew',
                'date_of_birth' => '1998-12-30',
                'is_active' => true
            ],
            [
                'national_id' => '00000008',
                'first_name' => 'Henok',
                'last_name' => 'Alemayehu',
                'date_of_birth' => '1993-06-17',
                'is_active' => true
            ],
            [
                'national_id' => '00000009',
                'first_name' => 'Selam',
                'last_name' => 'Wondimu',
                'date_of_birth' => '1997-02-25',
                'is_active' => true
            ],
            [
                'national_id' => '00000010',
                'first_name' => 'Ephrem',
                'last_name' => 'Tadesse',
                'date_of_birth' => '1985-08-14',
                'is_active' => true
            ],
        ]);
    }
}
