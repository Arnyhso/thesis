<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAllTasksRequest extends FormRequest
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
            "course_code" => ['nullable', 'string'],
            'task_type' => [
                'required',
                Rule::in(['gec', 'special', 'standing'])
            ],
            'gec_type' => [
                'nullable',
                Rule::in(['gec', 'elective', 'gee'])
            ],
            'prerequisite_id' => ['nullable', 'exists:all_tasks,id'],
            'corequisite_id' => ['nullable', 'exists:all_tasks,id'],
            "units" => ['required', 'integer', 'min:1'] // Add min or max if needed
        ];
    }
}
