<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssignedTasks extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'task_type',
        'gec_type',
        'status',
        'priority',
        'project_id',
        'max_units',
        'assigned_user_id',
        'assigned_by',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }
    public function assignedBy()
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }

}
