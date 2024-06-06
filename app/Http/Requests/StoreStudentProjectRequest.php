<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreStudentProjectRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['nullable', 'max:255'],
            'status' => ['nullable', Rule::in(['pending', 'in_progress', 'completed'])],
            'course_code' => ['nullable', 'string'],
            'selectedTasks' => ['array', 'nullable'],
            'selectedTasks.*' => ['integer', 'exists:tasks,id'], // Ensure each task ID exists in the all_tasks table
            'image_path' => ['nullable', 'string'], // Include other fields if needed
            'task_type' => ['nullable', 'string'],
            'gec_type' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'prerequisite' => ['nullable', 'string'],
            'corequisite' => ['nullable', 'string'],
            'prerequisite_id' => ['nullable', 'integer'],
            'corequisite_id' => ['nullable', 'integer'],
            'project_id' => ['nullable', 'integer'],
            'max_units' => ['required', 'integer', 'min:1'],
            'assigned_user_id' => ['nullable', 'exists:users,id'],
        ];
    }
}

