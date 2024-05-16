<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class TaskResource extends JsonResource
{
    public static $wrap = false;

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
            'description' => $this->description,
            'status' => $this->status,
            'prerequisite_id' => $this->prerequisite_id,
            'prerequisite' => new TaskResource($this->whenLoaded('prerequisite')),
            'corequisite_id' => $this->corequisite_id,
            'corequisite' => new TaskResource($this->whenLoaded('corequisite')),
            'priority' => $this->priority,
            'image_path' => $this->image_path ? Storage::url($this->image_path) : null,
            'project_id' => $this->project_id,
            'project' => new ProjectResource($this->whenLoaded('project')),
        ];
    }
}
