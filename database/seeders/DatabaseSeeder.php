<?php

namespace Database\Seeders;

use App\Models\AllTasks;
use App\Models\Project;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'ANGELO ESTRADA ANDRES',
            'user_type' => 'college_head',
            'email' => 'angeloandres521@yahoo.com',
            'password' => bcrypt('Cosmiku521*'),
            'email_verified_at' => now()
        ]);

        User::create([
            'name' => 'Sample Student',
            'user_type' => 'student',
            'email' => 'angeloandres521@gmail.com',
            'password' => bcrypt('Cosmiku521*'),
            'email_verified_at' => now()
        ]);

        $tasks = [
            [
                'name' => 'Sample Task 1',
                'course_code' => 'CS101',
                'task_type' => 'gec',
                'gec_type' => 'gec',
                'prerequisite_id' => null,
                'corequisite_id' => null,
                'units' => 3,
            ],
            [
                'name' => 'Sample Task 2',
                'course_code' => 'CS102',
                'task_type' => 'special',
                'gec_type' => null,
                'prerequisite_id' => 1,
                'corequisite_id' => null,
                'units' => 4,
            ],
            [
                'name' => 'Sample Task 3',
                'course_code' => 'CS103',
                'task_type' => 'standing',
                'gec_type' => null,
                'prerequisite_id' => null,
                'corequisite_id' => 2,
                'units' => 2,
            ],
            // Add more tasks as needed
        ];

        foreach ($tasks as $task) {
            AllTasks::create($task);
        }
    }
}
