<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AllTasks extends Model
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
    ];

    public function prerequisite()
    {
        return $this->belongsTo(AllTasks::class, 'prerequisite_id');
    }
    public function corequisite()
    {
        return $this->belongsTo(AllTasks::class, 'corequisite_id');
    }
}
