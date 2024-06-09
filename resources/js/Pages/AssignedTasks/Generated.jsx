import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PROJECT_STATUS_CLASS_MAP, PROJECT_STATUS_TEXT_MAP } from "@/constants.jsx";
import { Link, router } from "@inertiajs/react";

export default function Generated({ auth, success, assignedTasks, queryParams = null, projects, users, studentprojects }) {
  queryParams = queryParams || {};

  const chunkTables = [];

  let currentChunkInProgress = [];
  let currentChunkPending = [];
  let currentChunk = currentChunkInProgress;
  let currentUnits = 0;
  let maxUnits = assignedTasks.data.length > 0 ? assignedTasks.data[0].max_units : 0;

  // Separate tasks into in_progress and pending chunks
  assignedTasks.data.forEach((task) => {
    if (task.status === "in_progress") {
      currentChunkInProgress.push(task);
    } else if (task.status === "pending") {
      currentChunkPending.push(task);
    } else {
      // Ignore completed tasks
      return;
    }
  });

  // Push in_progress tasks as the first chunk
  if (currentChunkInProgress.length > 0) {
    chunkTables.push({ semester: assignedTasks.data[0].semester, tasks: currentChunkInProgress });
  }

  // Initialize the current semester
  let currentSemester = assignedTasks.data.length > 0 ? assignedTasks.data[0].semester + 1 : 1;

  // Define task type sequences
  const taskTypeSequences = ['gec->elective', 'gec->gec', 'special'];

  // Function to determine the number of sequences based on the semester
  const getNumSequencesForSemester = (semester) => {
    if (semester <= 2) return 3;
    if (semester <= 4) return 2;
    return 1;
  };

  let taskTypeQueues = {};

  // Initialize queues for each task type and gec type combination
  taskTypeSequences.forEach((type) => {
    if (type.startsWith('gec->')) {
      const gecType = type.split('->')[1];
      taskTypeQueues[type] = currentChunkPending.filter((task) => task.task_type === 'gec' && task.gec_type === gecType);
    } else {
      taskTypeQueues[type] = currentChunkPending.filter((task) => task.task_type === type);
    }
  });

  // Function to get the next task based on the task type and gec type in a round-robin fashion
  const getNextPendingTask = (currentTaskTypeSequenceIndex) => {
    let initialTaskTypeSequenceIndex = currentTaskTypeSequenceIndex;

    // Try to find a non-empty queue
    do {
      const type = taskTypeSequences[currentTaskTypeSequenceIndex];
      if (taskTypeQueues[type] && taskTypeQueues[type].length > 0) {
        const task = taskTypeQueues[type].shift();
        currentTaskTypeSequenceIndex = (currentTaskTypeSequenceIndex + 1) % taskTypeSequences.length;
        return { task, currentTaskTypeSequenceIndex };
      }
      currentTaskTypeSequenceIndex = (currentTaskTypeSequenceIndex + 1) % taskTypeSequences.length;
    } while (currentTaskTypeSequenceIndex !== initialTaskTypeSequenceIndex);

    return { task: null, currentTaskTypeSequenceIndex }; // Return null if no more tasks are found
  };

  // Process pending tasks based on task_type and gec_type, considering semesters
  currentChunk = [];
  currentUnits = 0;
  let currentTaskTypeSequenceIndex = 0;
  let { task, currentTaskTypeSequenceIndex: newTaskTypeIndex } = getNextPendingTask(currentTaskTypeSequenceIndex);
  let sequencesCount = 0;
  const maxSequencesCount = getNumSequencesForSemester(currentSemester);

  while (task) {
    currentChunk.push(task);
    currentUnits += task.units;

    // If max_units reached, push the chunk, increment semester, and reset counters
    if (currentUnits >= maxUnits) {
      chunkTables.push({ semester: currentSemester, tasks: currentChunk });
      currentChunk = [];
      currentUnits = 0;
      currentSemester += 1;
      sequencesCount = 0; // Reset sequence count for the new semester
      currentTaskTypeSequenceIndex = 0; // Reset the sequence index to start from gec->elective
    }

    // Increment sequence count and check if it exceeds max for current semester
    sequencesCount += 1;
    if (sequencesCount >= maxSequencesCount) {
      currentTaskTypeSequenceIndex = 2; // Move to the special task type after the sequences
    } else {
      currentTaskTypeSequenceIndex = newTaskTypeIndex;
    }

    // Get the next task based on task_type and gec_type in a round-robin fashion
    ({ task, currentTaskTypeSequenceIndex: newTaskTypeIndex } = getNextPendingTask(currentTaskTypeSequenceIndex));
  }

  // Push the remaining tasks, if any
  if (currentChunk.length > 0) {
    chunkTables.push({ semester: currentSemester, tasks: currentChunk });
  }

  // Separate remaining tasks (standing, gec->gee) into the last table chunk
  const remainingTasks = currentChunkPending.filter((task) => {
    return !((task.task_type === 'gec' && (task.gec_type === 'elective' || task.gec_type === 'gec')) || task.task_type === 'special');
  });

  if (remainingTasks.length > 0) {
    chunkTables.push({ semester: currentSemester + 1, tasks: remainingTasks });
  }

  // return ...

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Technological University of the Philippines - Manila
          </h2>
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Study Planner for Irregular Students
          </h2>
        </div>
      }
    >
      <Head title="Study Planner" />

      {/* Render each chunk as a separate table */}
      {chunkTables.map((chunk, index) => (
        <div key={index} className="py-12">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6 text-gray-900 dark:text-gray-100">
                {success && (
                  <div className="bg-emerald-500 py-2 px-4 text-white rounded mb-4">
                    {success}
                  </div>
                )}
                <div className="overflow-auto">
                  <h3 className="text-lg font-semibold mb-4">Semester {chunk.semester}</h3>
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                      <tr className="text-nowrap">
                        <th className="px-3 py-3">Image</th>
                        <th className="px-3 py-3">Subject Name</th>
                        <th className="px-3 py-3">Status</th>
                        <th className="px-3 py-3">Course Code</th>
                        <th className="px-3 py-3">Units</th>
                        <th className="px-3 py-3">Max Units</th>
                        <th className="px-3 py-3">Instructor Name</th>
                        <th className="px-3 py-3">Room</th>
                        <th className="px-3 py-3">Day</th>
                        <th className="px-3 py-3">Time</th>
                        <th className="px-3 py-3">Task Type</th>
                        <th className="px-3 py-3">GEC Type</th>
                        <th className="px-3 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {chunk.tasks.map((assignedTask) => (
                        <tr
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                          key={assignedTask.id}
                        >
                          <td className="px-3 py-2">
                            <img src={assignedTask.image_path} style={{ width: 60 }} />
                          </td>
                          <th className="px-3 py-2 text-gray-100 hover:underline">
                            <Link href={route("task.show", assignedTask.id)}>{assignedTask.name}</Link>
                          </th>
                          <td className="px-3 py-2">
                            <span
                              className={
                                "px-2 py-1 rounded text-nowrap text-white " +
                                PROJECT_STATUS_CLASS_MAP[assignedTask.status]
                              }
                            >
                              {PROJECT_STATUS_TEXT_MAP[assignedTask.status]}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-nowrap">{assignedTask.course_code}</td>
                          <td className="px-3 py-2 text-nowrap">{assignedTask.units}</td>
                          <td className="px-3 py-2 text-nowrap">{assignedTask.max_units}</td>
                          <td className="px-3 py-2 text-nowrap">{assignedTask.prof_name}</td>
                          <td className="px-3 py-2 text-nowrap">{assignedTask.room_num}</td>
                          <td className="px-3 py-2 text-nowrap">{assignedTask.day}</td>
                          <td className="px-3 py-2 text-nowrap">{assignedTask.start_time} - {assignedTask.end_time}</td>
                          <td className="px-3 py-2 text-nowrap">{assignedTask.task_type}</td>
                          <td className="px-3 py-2 text-nowrap">{assignedTask.gec_type}</td>
                          <td className="px-3 py-2 text-nowrap">
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </AuthenticatedLayout>
  );
}
