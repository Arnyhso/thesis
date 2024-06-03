<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'course_code',
        'task_type',
        'gec_type',
        'prerequisite_id',
        'corequisite_id',
        'units',

        'description',
        'image_path',
        'project_id',
        
        'prof_name',
        'room_num',
        'day',
        'start_time',
        'end_time',

    ];

    protected $casts = [
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function StudentProject()
    {
        return $this->belongsTo(StudentProject::class);
    }

    public function prerequisite()
    {
    return $this->belongsTo(Task::class, 'prerequisite_id');
    }

    public function corequisite()
    {
    return $this->belongsTo(Task::class, 'corequisite_id');
    }
}
