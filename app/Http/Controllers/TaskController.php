<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProjectResource;
use App\Http\Resources\TaskResource;
use App\Http\Resources\UserResource;
use App\Models\Project;
use App\Models\Task;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Task $task)
    {
        $query = Task::query();

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }
        if (request("task_type")) {
            $query->where("task_type", request("task_type"));
        }

        $tasks = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia("Task/Index", [
            "tasks" => TaskResource::collection($tasks),
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
    $task = Task::query()->orderBy('name', 'asc')->get();
    $prerequisites = Task::orderBy('name', 'asc')->get();
    $corequisites = Task::orderBy('name', 'asc')->get();

    return inertia("Task/Create", [
        'projects' => ProjectResource::collection($projects),
        'users' => UserResource::collection($users),
        'task' => TaskResource::collection($task),
        'prerequisites' => TaskResource::collection($prerequisites),
        'corequisites' => TaskResource::collection($corequisites),
    ]);
}


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        $data = $request->validated();
        /** @var $image \Illuminate\Http\UploadedFile */
        $image = $data['image'] ?? null;
        if ($image) {
            $data['image_path'] = $image->store('task/' . Str::random(), 'public');
        }
        $data['project_id'] = $request->input('project_id'); // Add project_id to task data
        // Create task
        $task = Task::create($data);

        return redirect()->route('task.index')
            ->with('success', 'Task was created')
            ->with('task', $task); // Optionally, pass the created task instance in the response
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        $project = $task->project;

        $prerequisite = null;
    if ($task->prerequisite_id) {
        $prerequisite = Task::findOrFail($task->prerequisite_id);
    }

    $corequisite = null;
    if ($task->corequisite_id) {
        $corequisite = Task::findOrFail($task->corequisite_id);
    }

        return inertia('Task/Show', [
            'task' => $task,
            'project' => $project,
            'prerequisite' => $prerequisite,
            'corequisite' => $corequisite,
    ]);
}
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
{
    $projects = Project::query()->orderBy('name', 'asc')->get();
    $users = User::query()->orderBy('name', 'asc')->get();
    $projectTasks = Task::where('project_id', $task->project_id)->get();
    $prerequisites = Task::orderBy('name', 'asc')->get();
    $corequisites = Task::orderBy('name', 'asc')->get();

    return inertia("Task/Edit", [
        'task' => new TaskResource($task),
        'projects' => ProjectResource::collection($projects),
        'users' => UserResource::collection($users),
        'prerequisites' => TaskResource::collection($prerequisites),
        'corequisites' => TaskResource::collection($corequisites),
        'projectTasks' =>TaskResource::collection($projectTasks),
    ]);
}


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        $data = $request->validated();
        $image = $data['image'] ?? null;
        $data['updated_by'] = Auth::id();
        if ($image) {
            if ($task->image_path) {
                Storage::disk('public')->deleteDirectory(dirname($task->image_path));
            }
            $data['image_path'] = $image->store('task/' . Str::random(), 'public');
        }
        $task->update($data);

        return to_route('task.index')
            ->with('success', "Task \"$task->name\" was updated");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $name = $task->name;
        $task->delete();
        if ($task->image_path) {
            Storage::disk('public')->deleteDirectory(dirname($task->image_path));
        }
        return to_route('task.index')
            ->with('success', "Task \"$name\" was deleted");
    }

    public function myTasks()
    {
        $user = auth()->user();
        $query = Task::query()->where('assigned_user_id', $user->id);

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }
        if (request("task_type")) {
            $query->where("task_type", request("task_type"));
        }

        $tasks = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia("Task/Index", [
            "tasks" => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }
}
