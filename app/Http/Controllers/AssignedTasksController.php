<?php

namespace App\Http\Controllers;

use App\Http\Resources\AssignedTasksResource;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\StudentProjectResource;
use App\Http\Resources\UserResource;
use App\Models\Project;
use App\Models\AssignedTasks;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAssignedTasksRequest;
use App\Http\Requests\UpdateAssignedTasksRequest;
use App\Models\StudentProject;
use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class AssignedTasksController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(AssignedTasks $assignedTasks)
    {
        $query = AssignedTasks::query();
        $projects = Project::query()->orderBy('name', 'asc')->get();
        $studentprojects = StudentProject::query()->orderBy('name', 'asc')->get();
        $users = User::query()->orderBy('name', 'asc')->get();
        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }
        if (request("status")) {
            $query->where("status", request("status"));
        }

        $assignedTask = $query->orderBy($sortField, $sortDirection)
            ->paginate(100)
            ->onEachSide(1);

        return inertia("AssignedTasks/Index", [
            'projects' => ProjectResource::collection($projects),
            'studentprojects' => StudentProjectResource::collection($studentprojects),
            'users' => UserResource::collection($users),
            "assignedTask" => AssignedTasksResource::collection($assignedTask),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $projects = Project::query()->orderBy('name', 'asc')->get();
        $users = User::query()->orderBy('name', 'asc')->get();
        $assignedTasks = AssignedTasks::query()->orderBy('name', 'asc')->get();
        $prerequisites = AssignedTasks::orderBy('name', 'asc')->get();
        $corequisites = AssignedTasks::orderBy('name', 'asc')->get();

        return inertia("AssignedTasks/Create", [
            'projects' => ProjectResource::collection($projects),
            'users' => UserResource::collection($users),
            'assignedTasks' => AssignedTasksResource::collection($assignedTasks),
            'prerequisites' => AssignedTasksResource::collection($prerequisites),
            'corequisites' => AssignedTasksResource::collection($corequisites),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAssignedTasksRequest $request)
    {
        $data = $request->validated();

        AssignedTasks::create($data);

        // Additional logic for tasks can be added here

        return to_route('assignedTasks.index')
            ->with('success', 'Task was created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(AssignedTasks $assignedTasks)
    {

        $prerequisite = null;
        if ($assignedTasks->prerequisite_id) {
            $prerequisite = AssignedTasks::findOrFail($assignedTasks->prerequisite_id);
        }

        $corequisite = null;
        if ($assignedTasks->corequisite_id) {
            $corequisite = AssignedTasks::findOrFail($assignedTasks->corequisite_id);
        }

        return inertia('AssignedTasks/Show', [
            'assignedTasks' => $assignedTasks,
            'prerequisite' => $prerequisite,
            'corequisite' => $corequisite,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AssignedTasks $AssignedTask)
    {
        return inertia('AssignedTasks/Edit', [
            'AssignedTask' => new AssignedTasksResource($AssignedTask),
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAssignedTasksRequest $request, AssignedTasks $assignedTask)
    {
        $data = $request->validated();

        // Check if the status key exists in the validated data
        if (array_key_exists('status', $data)) {
            $assignedTask->update(['status' => $data['status']]);
            return to_route('assignedTasks.Planner')->with('success', 'Status was updated');
        }

        // If the status key doesn't exist, proceed with the regular update
        $assignedTask->update($data);
        return to_route('assignedTasks.index')->with('success', 'Task was updated');
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AssignedTasks $assignedTasks)
    {
        $name = $assignedTasks->name;
        $assignedTasks->delete();
        if ($assignedTasks->image_path) {
            Storage::disk('public')->deleteDirectory(dirname($assignedTasks->image_path));
        }
        return to_route('assignedTasks.index')
            ->with('success', "Task \"$name\" was deleted");
    }

    public function Planner(AssignedTasks $assignedTasks)
    {
        $user = auth()->user();
        $query = AssignedTasks::query()->where('assigned_user_id', $user->id);
        $projects = Project::query()->orderBy('name', 'asc')->get();
        $studentprojects = StudentProject::query()->orderBy('name', 'asc')->get();
        $users = User::query()->orderBy('name', 'asc')->get();
        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }

        if (request("status")) {
            $query->where("status", request("status"));
        }

        $assignedTask = $query->orderBy($sortField, $sortDirection)
            ->get();

        return inertia("AssignedTasks/Planner", [
            'projects' => ProjectResource::collection($projects),
            'studentprojects' => StudentProjectResource::collection($studentprojects),
            'users' => UserResource::collection($users),
            "assignedTask" => AssignedTasksResource::collection($assignedTask),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    public function Generated(AssignedTasks $assignedTasks)
    {
        $user = auth()->user();
        $query = AssignedTasks::query()->where('assigned_user_id', $user->id);
        $projects = Project::query()->orderBy('name', 'asc')->get();
        $studentprojects = StudentProject::query()->orderBy('name', 'asc')->get();
        $users = User::query()->orderBy('name', 'asc')->get();
        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }

        if (request("status")) {
            $query->where("status", request("status"));
        }

        $assignedTasks = $query->orderBy($sortField, $sortDirection)
            ->get();

        return inertia("AssignedTasks/Generated", [
            'projects' => ProjectResource::collection($projects),
            'studentprojects' => StudentProjectResource::collection($studentprojects),
            'users' => UserResource::collection($users),
            "assignedTasks" => AssignedTasksResource::collection($assignedTasks),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

}
