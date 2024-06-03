<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class AssignedTasksResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'course_code' => $this->course_code,
            'task_type' => $this->task_type,
            'gec_type' => $this->gec_type,
            'prerequisite_id' => $this->prerequisite_id,
            'prerequisite' => new AssignedTasksResource($this->whenLoaded('prerequisite')),
            'corequisite_id' => $this->corequisite_id,
            'corequisite' => new AssignedTasksResource($this->whenLoaded('corequisite')),
            'units' => $this->units,

            'description' => $this->description,
            'image_path' => $this->image_path ? Storage::url($this->image_path) : null,
            'project_id' => $this->project_id,
            'project' => new ProjectResource($this->whenLoaded('project')),


            'prof_name' => $this->prof_name,
            'room_num' => $this->room_num,
            'day' => $this->day,
            'start_time' => $this->start_time ? Carbon::parse($this->start_time)->format('H:i') : null,
            'end_time' => $this->end_time ? Carbon::parse($this->end_time)->format('H:i') : null,

            'status' => $this->status,
            'priority' => $this->priority,
            'max_units' => $this->max_units,
            'assigned_user_id' => $this->assigned_user_id,
            'assigned_user' => new UserResource($this->whenLoaded('assigned_user')),
            'assigned_by' => $this->assigned_by,
            'assigned_by_user' => new UserResource($this->whenLoaded('assignedByUser')),
            'semester' => $this->semester,
        ];
    }
}
