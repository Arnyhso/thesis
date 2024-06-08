<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAssignedTasksRequest extends FormRequest
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
            'name' => ['required', 'max:255'],
            "course_code" => ['nullable', 'string'],
            'task_type' => ['required', Rule::in(['gec', 'special', 'standing'])],
            'gec_type' => ['nullable', Rule::in(['gec', 'elective', 'gee'])],
            'prerequisite_id' => ['nullable', 'exists:all_tasks,id'],
            'corequisite_id' => ['nullable', 'exists:all_tasks,id'],
            'units' => ['required', 'integer', 'min:1'],

            'description' => ['nullable', 'string'],
            'image_path' => ['nullable', 'image'],
            'project_id' => ['required', 'exists:projects,id'],
            
            'prof_name' => ['nullable', 'string', 'max:255'],
            'room_num' => ['nullable', 'string', 'max:255'],
            'day' => ['nullable', Rule::in(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])],
            'start_time' => ['nullable', 'date_format:H:i'],
            'end_time' => ['nullable', 'date_format:H:i', 'after:start_time'],

            'status' => ['nullable', Rule::in(['pending', 'in_progress', 'completed'])],
            'priority' => ['nullable', 'string', 'max:255'],
            'max_units' => ['required', 'integer', 'min:1'],
            'assigned_user_id' => ['nullable', 'exists:users,id'],
            'assigned_by' => ['nullable', 'exists:users,id'],
            'semester' => ['nullable', 'integer', 'min:1'],
            'selectedTasks' => ['array', 'nullable'],
            'selectedTasks.*' => ['integer', 'exists:all_tasks,id'],
        ];
    }
}
