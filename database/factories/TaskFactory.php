<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Default Task Name',
            'course_code' => 'Default Course Code',
            'description' => 'Default Task Description',
            'image_path' => null,
            'status' => 'pending',
            'prerequisite' => 'Default Prerequisite',
            'corequisite' => 'Default Corequisite',
            'prerequisite_id' => null,
            'corequisite_id' => null,
            'priority' => 'medium',
            'project_id' => 1, // Assuming you have a project with ID 1
        ];
    }
}
