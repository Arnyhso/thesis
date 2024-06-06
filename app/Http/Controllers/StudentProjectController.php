<?php

namespace App\Http\Controllers;

use App\Http\Resources\AssignedTasksResource;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\StudentProjectResource;
use App\Http\Resources\TaskResource;
use App\Http\Resources\UserResource;
use App\Models\AllTasks;
use App\Models\AssignedTasks;
use App\Models\Project;
use App\Models\StudentProject;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStudentProjectRequest;
use App\Http\Requests\UpdateStudentProjectRequest;
use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Arr;


class StudentProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = StudentProject::query();

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }
        if (request("status")) {
            $query->where("status", request("status"));
        }

        $studentProject = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia("StudentProject/Index", [
            "studentProject" => StudentProjectResource::collection($studentProject),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $task = Task::query()->orderBy('name', 'asc')->get();
        $projects = Project::query()->orderBy('name', 'asc')->get();
        $assignedTasks = AssignedTasks::query()->orderBy('name', 'asc')->get();
        $users = User::query()->orderBy('name', 'asc')->get();
        return inertia("StudentProject/Create", [
            'task' => TaskResource::collection($task),
            'projects' => ProjectResource::collection($projects),
            'assignedTasks' => AssignedTasksResource::collection($assignedTasks),
            'users' => UserResource::collection($users),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStudentProjectRequest $request)
    {
        $data = $request->validated();
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();

        LOG::info("Received data: ", $data);
        $project = StudentProject::create($data);

        // Create the tasks and associate them with the project
        if (!empty($data['selectedTasks'])) {
            foreach ($data['selectedTasks'] as $taskId) {
                // Find task info from AllTasks
                $taskInfo = Task::find($taskId);

                if ($taskInfo) {
                    // Validate task data
                    Log::info('Task info:', $taskInfo->toArray()); // Log task info
                    //$taskInfo['project_id'] = $project->id;

                    // Create task with validated task data
                    AssignedTasks::create([
                        'name' => $taskInfo->name,
                        'prerequisite_id' => $taskInfo->prerequisite_id,
                        'corequisite_id' => $taskInfo->corequisite_id,
                        'project_id' => $project->id,
                        'task_type' => $taskInfo->task_type,
                        'gec_type' => $taskInfo->gec_type,
                        'units' => $taskInfo->units,
                        'day' => $taskInfo->day,
                        'max_units' => $data['max_units'],
                        'assigned_user_id' => $data['assigned_user_id'],
                        'status' => $data['status'],
                    ]);
                } else {
                    throw new \Exception("Task with ID $taskId not found.");
                }
            }
        } else {
            throw new \Exception('No selected tasks.');
        }

        return redirect()->route('studentProject.index')->with([
            'success' => 'Project created successfully.',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(StudentProject $studentProject)
    {
        $query = $studentProject->tasks();

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

        return inertia('StudentProject/Show', [
            'studentProject' => new StudentProjectResource($studentProject),
            "tasks" => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StudentProject $studentProject)
    {
        return inertia('StudentProject/Edit', [
            'studentProject' => new StudentProjectResource($studentProject),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStudentProjectRequest $request, StudentProject $studentProject)
    {
        $data = $request->validated();
        $data['updated_by'] = Auth::id();
        $studentProject->update($data);

        return to_route('studentProject.index')
            ->with('success', "Project \"$studentProject->name\" was updated");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StudentProject $studentProject)
    {
        $name = $studentProject->name;
        $studentProject->delete();

        return to_route('studentProject.index')
            ->with('success', "Project \"$name\" was deleted");
    }
}
