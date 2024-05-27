<?php

namespace App\Http\Controllers;

use App\Http\Resources\AllTasksResource;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\UserResource;
use App\Models\AllTasks;
use App\Http\Requests\StoreAllTasksRequest;
use App\Http\Requests\UpdateAllTasksRequest;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AllTasksController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(AllTasks $allTask)
    {
        $query = AllTasks::query();

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }
        if (request("task_type")) {
            $query->where("task_type", request("task_type"));
        }

        $allTasks = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia("AllTask/Index", [
            "allTasks" => AllTasksResource::collection($allTasks),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $allTask = AllTasks::query()->orderBy('name', 'asc')->get();
        $prerequisites = AllTasks::orderBy('name', 'asc')->get();
        $corequisites = AllTasks::orderBy('name', 'asc')->get();

        return inertia("AllTask/Create", [
            'allTask' => AllTasksResource::collection($allTask),
            'prerequisites' => AllTasksResource::collection($prerequisites),
            'corequisites' => AllTasksResource::collection($corequisites),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAllTasksRequest $request)
    {
        $data = $request->validated();
        /** @var $image \Illuminate\Http\UploadedFile */
        $image = $data['image'] ?? null;
        if ($image) {
            $data['image_path'] = $image->store('allTask/' . Str::random(), 'public');
        }
        AllTasks::create($data);

        return to_route('allTask.index')
            ->with('success', 'Task was created');
    }

    /**
     * Display the specified resource.
     */
    public function show(AllTasks $allTask)
    {
        $project = $allTask->project;

        $prerequisite = null;
        if ($allTask->prerequisite_id) {
            $prerequisite = AllTasks::findOrFail($allTask->prerequisite_id);
        }

        $corequisite = null;
        if ($allTask->corequisite_id) {
            $corequisite = AllTasks::findOrFail($allTask->corequisite_id);
        }

        return inertia('AllTask/Show', [
            'allTask' => $allTask,
            'project' => $project,
            'prerequisite' => $prerequisite,
            'corequisite' => $corequisite,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AllTasks $allTask)
    {
        $projects = Project::query()->orderBy('name', 'asc')->get();
        $users = User::query()->orderBy('name', 'asc')->get();
        $projectTasks = AllTasks::where('project_id', $allTask->project_id)->get();
        $prerequisites = AllTasks::orderBy('name', 'asc')->get();
        $corequisites = AllTasks::orderBy('name', 'asc')->get();

        return inertia("AllTask/Edit", [
            'allTask' => new AllTasksResource($allTask),
            'projects' => ProjectResource::collection($projects),
            'users' => UserResource::collection($users),
            'prerequisites' => AllTasksResource::collection($prerequisites),
            'corequisites' => AllTasksResource::collection($corequisites),
            'projectTasks' => AllTasksResource::collection($projectTasks),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAllTasksRequest $request, AllTasks $allTask)
    {
        $data = $request->validated();
        $image = $data['image'] ?? null;
        $data['updated_by'] = Auth::id();
        if ($image) {
            if ($allTask->image_path) {
                Storage::disk('public')->deleteDirectory(dirname($allTask->image_path));
            }
            $data['image_path'] = $image->store('allTask/' . Str::random(), 'public');
        }
        $allTask->update($data);

        return to_route('allTask.index')
            ->with('success', "Task \"$allTask->name\" was updated");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AllTasks $allTask)
    {
        $name = $allTask->name;
        $allTask->delete();
        if ($allTask->image_path) {
            Storage::disk('public')->deleteDirectory(dirname($allTask->image_path));
        }
        return to_route('allTask.index')
            ->with('success', "Task \"$name\" was deleted");
    }
}
