<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->longText('description')->nullable();
            $table->string('image_path')->nullable();
            $table->string('task_type')->nullable();
            $table->string('gec_type')->nullable();
            $table->foreignId('project_id')->constrained('projects');
            $table->foreignId('prerequisite_id')->nullable()->constrained('tasks');
            $table->foreignId('corequisite_id')->nullable()->constrained('tasks');
            $table->integer('units');
            $table->string('prof_name')->nullable();
            $table->string('room_num')->nullable();
            $table->string('day')->nullable();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
