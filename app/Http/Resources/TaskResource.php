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
            'description' => $this->description,
            'image_path' => $this->image_path ? Storage::url($this->image_path) : null,
            'task_type' => $this->task_type,
            'gec_type' => $this->gec_type,
            'prerequisite_id' => $this->prerequisite_id,
            'prerequisite' => new TaskResource($this->whenLoaded('prerequisite')),
            'corequisite_id' => $this->corequisite_id,
            'corequisite' => new TaskResource($this->whenLoaded('corequisite')),
            'project_id' => $this->project_id,
            'project' => new ProjectResource($this->whenLoaded('project')),
            'prof_name' => $this->prof_name,
            'room_num' => $this->room_num,
            'units' => $this->units,
            'day' => $this->day,
            'start_time' => $this->start_time ? Carbon::parse($this->start_time)->format('H:i') : null,
            'end_time' => $this->end_time ? Carbon::parse($this->end_time)->format('H:i') : null,
        ];
    }
}
