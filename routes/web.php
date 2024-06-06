<?php


use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\StudentProjectController;
use App\Http\Controllers\StudentTaskController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\AllTasksController;
use App\Http\Controllers\AssignedTasksController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', '/dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::get('/project/assign', [ProjectController::class, 'assign'])
        ->name('project.assign');
    Route::get('/project/student', [ProjectController::class, 'student'])
        ->name('project.student');
    Route::post('/project/student-store', [ProjectController::class, 'studentStore'])->name('project.studentStore');
    
    Route::get('/assignedTasks/Planner', [AssignedTasksController::class, 'Planner'])
        ->name('assignedTasks.Planner');
    Route::get('/assignedTasks/Generated', [AssignedTasksController::class, 'Generated'])
        ->name('assignedTasks.Generated');
    Route::resource('project', ProjectController::class);
    Route::resource('allTask', AllTasksController::class);
    Route::resource('assignedTasks', AssignedTasksController::class);
    Route::resource('studentTask', StudentTaskController::class);
    Route::resource('studentProject', StudentProjectController::class);
    Route::get('/task/schedule', [TaskController::class, 'schedule'])
        ->name('task.schedule');
    Route::get('/tasks/{task}/scheduleedit', [TaskController::class, 'scheduleedit'])->name('task.scheduleedit');
    Route::resource('task', TaskController::class);
    Route::resource('user', UserController::class);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
