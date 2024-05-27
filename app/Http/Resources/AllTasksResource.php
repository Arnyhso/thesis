<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class AllTasksResource extends JsonResource
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
            'task_type' => $this->task_type,
            'gec_type' => $this->gec_type,
            'prerequisite_id' => $this->prerequisite_id,
            'prerequisite' => new AllTasksResource($this->whenLoaded('prerequisite')),
            'corequisite_id' => $this->corequisite_id,
            'corequisite' => new AllTasksResource($this->whenLoaded('corequisite')),
        ];
    }
}
