<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'image_path',
        'status',
        'priority',
        'project_id',
        'prerequisite_id',
        'corequisite_id',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
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
