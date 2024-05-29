<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTaskRequest extends FormRequest
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
            "name" => ['required', 'max:255'],
            'image_path' => ['nullable', 'image'],
            "description" => ['nullable', 'string'],
            'project_id' => ['required', 'exists:projects,id'],
            'prerequisite_id' => ['nullable', 'exists:tasks,id'],
            'corequisite_id' => ['nullable', 'exists:tasks,id'],
            'task_type' => [
                'required',
                Rule::in(['gec', 'special', 'standing'])
            ],
            'gec_type' => [
                'nullable',
                Rule::in(['gec', 'elective', 'gee'])
            ],
            "units" => ['required', 'integer', 'min:1'],
            'prof_name' => ['nullable', 'string', 'max:255'],
            'room_num' => ['nullable', 'string', 'max:255'],
            'day' => ['nullable', Rule::in(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])],
            'start_time' => ['nullable', 'date_format:H:i'],
            'end_time' => ['nullable', 'date_format:H:i', 'after:start_time'],
        ];
    }
}
