<?php

namespace App\Http\Controllers;


use App\Http\Resources\AllTasksResource;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\TaskResource;
use App\Models\AllTasks;
use App\Models\Project;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreTaskRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Arr;


class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Project::query();

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }
        if (request("status")) {
            $query->where("status", request("status"));
        }

        $projects = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia("Project/Index", [
            "projects" => ProjectResource::collection($projects),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $allTasks = AllTasks::query()->orderBy('name', 'asc')->get();
        return inertia("Project/Create", [
            'allTasks' => AllTasksResource::collection($allTasks),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request)
    {
        $data = $request->validated();
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();

        $selectedTasks = Arr::get($data, 'selectedTasks', []);


        Log::info('Selected Tasks:', $selectedTasks);
            // Create the project
            $project = Project::create($data);

            // Create the tasks and associate them with the project
        if (!empty($data['selectedTasks'])) {
            foreach ($data['selectedTasks'] as $taskId) {
                // Find task info from AllTasks
                $taskInfo = AllTasks::find($taskId);

                if ($taskInfo) {
                    // Validate task data
                    $taskInfo['project_id'] = $project->id;

                    // Create task with validated task data
                    Task::create([
                        'name' => $taskInfo->name,
                        'prerequisite_id' => $taskInfo->prerequisite_id,
                        'corequisite_id' => $taskInfo->corequisite_id,
                        'project_id' => $project->id,
                        'task_type' => $taskInfo->task_type,
                        'gec_type' => $taskInfo->gec_type,
                        'units' => $taskInfo->units,
                        'day' => $taskInfo->day,
                    ]);
                } else {
                    throw new \Exception("Task with ID $taskId not found.");
                }
            }
        } else {
            throw new \Exception('No selected tasks.');
        }


        return redirect()->route('project.index')->with([
                'success' => 'Project created successfully.',
            ]);
    }


    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {

        $query = $project->tasks();

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }
        if (request("status")) {
            $query->where("status", request("status"));
        }

        $tasks = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);
        return inertia('Project/Show', [
            'project' => new ProjectResource($project),
            "tasks" => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        return inertia('Project/Edit', [
            'project' => new ProjectResource($project),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project)
    {
        $data = $request->validated();
        $data['updated_by'] = Auth::id();
        $project->update($data);

        return to_route('project.index')
            ->with('success', "Project \"$project->name\" was updated");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        $name = $project->name;
        $project->delete();

        return to_route('project.index')
            ->with('success', "Project \"$name\" was deleted");
    }
}
