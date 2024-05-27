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
        Schema::create('all_tasks', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('course_code')->nullable();
            $table->string('task_type')->nullable();
            $table->string('gec_type')->nullable();
            $table->foreignId('prerequisite_id')->nullable()->constrained('all_tasks');
            $table->foreignId('corequisite_id')->nullable()->constrained('all_tasks');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('all_tasks');
    }
};
