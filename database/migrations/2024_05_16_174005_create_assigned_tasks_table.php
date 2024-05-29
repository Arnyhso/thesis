<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('assigned_tasks', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('task_type')->nullable();
            $table->string('gec_type')->nullable();
            $table->string('status');
            $table->string('priority');
            $table->foreignId('project_id')->constrained('projects');
            $table->integer('units');
            $table->integer('max_units');
            $table->foreignId('assigned_user_id')->constrained('users');
            $table->foreignId('assigned_by')->constrained('users');
            $table->foreignId('prerequisite_id')->nullable()->constrained('assigned_tasks');
            $table->foreignId('corequisite_id')->nullable()->constrained('assigned_tasks');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assigned_tasks');
    }
};
