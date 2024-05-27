<?php

namespace App\Http\Controllers;

use App\Models\AssignedTasks;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAssignedTasksRequest;
use App\Http\Requests\UpdateAssignedTasksRequest;

class AssignedTasksController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAssignedTasksRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(AssignedTasks $assignedTasks)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AssignedTasks $assignedTasks)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAssignedTasksRequest $request, AssignedTasks $assignedTasks)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AssignedTasks $assignedTasks)
    {
        //
    }
}
