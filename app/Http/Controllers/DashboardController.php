<?php

namespace App\Http\Controllers;

use App\Http\Resources\AssignedTasksResource;
use App\Models\AssignedTasks;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $totalPendingTasks = AssignedTasks::query()
            ->where('status', 'pending')
            ->count();
        $myPendingTasks = AssignedTasks::query()
            ->where('status', 'pending')
            ->where('assigned_user_id', $user->id)
            ->count();


        $totalProgressTasks = AssignedTasks::query()
            ->where('status', 'in_progress')
            ->count();
        $myProgressTasks = AssignedTasks::query()
            ->where('status', 'in_progress')
            ->where('assigned_user_id', $user->id)
            ->count();


        $totalCompletedTasks = AssignedTasks::query()
            ->where('status', 'completed')
            ->count();
        $myCompletedTasks = AssignedTasks::query()
            ->where('status', 'completed')
            ->where('assigned_user_id', $user->id)
            ->count();

        $activeTasks = AssignedTasks::query()
            ->whereIn('status', ['pending', 'in_progress'])
            ->where('assigned_user_id', $user->id)
            ->get();
            
        $activeTasks = AssignedTasksResource::collection($activeTasks);
        return inertia(
            'Dashboard',
            compact(
                'totalPendingTasks',
                'myPendingTasks',
                'totalProgressTasks',
                'myProgressTasks',
                'totalCompletedTasks',
                'myCompletedTasks',
                'activeTasks'
            )
        );
    }
}
