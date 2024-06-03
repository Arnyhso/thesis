<?php

namespace App\Http\Controllers;

use App\Http\Resources\AssignedTasksResource;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\UserResource;
use App\Models\Project;
use App\Models\AssignedTasks;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAssignedTasksRequest;
use App\Http\Requests\UpdateAssignedTasksRequest;
use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AssignedTasksController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(AssignedTasks $assignedTasks)
    {
        $query = AssignedTasks::query();

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }
        if (request("task_type")) {
            $query->where("task_type", request("task_type"));
        }

        $assignedTasks = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia("AssignedTasks/Index", [
            "assignedTasks" => AssignedTasksResource::collection($assignedTasks),
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
        $project = $assignedTasks->project;

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
            'project' => $project,
            'prerequisite' => $prerequisite,
            'corequisite' => $corequisite,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AssignedTasks $assignedTasks)
    {
        $projects = Project::query()->orderBy('name', 'asc')->get();
        $users = User::query()->orderBy('name', 'asc')->get();
        $projectTasks = AssignedTasks::where('project_id', $assignedTasks->project_id)->get();
        $prerequisites = AssignedTasks::orderBy('name', 'asc')->get();
        $corequisites = AssignedTasks::orderBy('name', 'asc')->get();

        return inertia("AssignedTasks/Edit", [
            'assignedTasks' => new AssignedTasksResource($assignedTasks),
            'projects' => ProjectResource::collection($projects),
            'users' => UserResource::collection($users),
            'prerequisites' => AssignedTasksResource::collection($prerequisites),
            'corequisites' => AssignedTasksResource::collection($corequisites),
            'projectTasks' => AssignedTasksResource::collection($projectTasks),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAssignedTasksRequest $request, AssignedTasks $assignedTasks)
    {
        $data = $request->validated();
        $image = $data['image'] ?? null;
        if ($image) {
            if ($assignedTasks->image_path) {
                Storage::disk('public')->deleteDirectory(dirname($assignedTasks->image_path));
            }
            $data['image_path'] = $image->store('task/' . Str::random(), 'public');
        }

        /* if (!$this->professorIsAvailable($data['prof_name'], $data['start_time'], $data['end_time'], $data['day'])) {
            return redirect()->back()->withInput()->withErrors(['prof_name' => 'Professor is not available during the specified time on the given day.']);
        }

        if (!$this->roomIsAvailable($data['room_num'], $data['start_time'], $data['end_time'], $data['day'])) {
            return redirect()->back()->withInput()->withErrors(['room_num' => 'Room is not available during the specified time on the given day.']);
        } */

        $assignedTasks->update($data);

        return to_route('AssignedTasks.index')
            ->with('success', "Task \"$assignedTasks->name\" was updated");
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
}
