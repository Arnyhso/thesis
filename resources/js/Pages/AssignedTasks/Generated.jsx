import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PROJECT_STATUS_CLASS_MAP, PROJECT_STATUS_TEXT_MAP } from "@/constants.jsx";
import { Link, router } from "@inertiajs/react";

export default function Generated({ auth, success, allTasks, assignedTasks, queryParams = null, projects, users, studentprojects }) {
  queryParams = queryParams || {};

const chunkTables = [];

let currentChunkInProgress = [];
let currentChunkPending = [];
let currentChunk = currentChunkInProgress;
let currentUnits = 0;
let maxUnits = assignedTasks.data.length > 0 ? assignedTasks.data[0].max_units : 0;

// Separate tasks into in_progress and pending chunks
assignedTasks.data.forEach((task) => {
  task.prerequisites = task.prerequisites || [];  // Ensure prerequisites field exists
  task.corequisites = task.corequisites || [];    // Ensure corequisites field exists

  if (task.status === "in_progress") {
    currentChunkInProgress.push(task);
  } else if (task.status === "pending") {
    currentChunkPending.push(task);
  } else {
    // Ignore completed tasks
    return;
  }
});

// Fetch prerequisite and corequisite names from assignedTasks library
const fetchPrerequisiteAndCorequisiteNames = (task) => {
  task.prerequisiteNames = task.prerequisites.map(prereqId => allTasks.find(t => t.id === prereqId)?.name);
  task.corequisiteNames = task.corequisites.map(coreqId => allTasks.find(t => t.id === coreqId)?.name);
};

currentChunkInProgress.forEach(fetchPrerequisiteAndCorequisiteNames);
currentChunkPending.forEach(fetchPrerequisiteAndCorequisiteNames);

// Push in_progress tasks as the first chunk
if (currentChunkInProgress.length > 0) {
  chunkTables.push(currentChunkInProgress);
}

// Sort tasks based on dependencies
const sortTasksByDependencies = (tasks) => {
  const taskMap = {};
  tasks.forEach(task => taskMap[task.id] = task);

  const sortedTasks = [];
  const visited = new Set();

  const visit = (task) => {
    if (visited.has(task.id)) return;
    visited.add(task.id);

    task.prerequisites.forEach(prereqId => {
      if (taskMap[prereqId]) visit(taskMap[prereqId]);
    });

    sortedTasks.push(task);
  };

  tasks.forEach(task => visit(task));

  return sortedTasks;
};

currentChunkPending = sortTasksByDependencies(currentChunkPending);

// Apply task_type and gec_type constraints within max_units slicing
const taskTypeSequences = ['gec->elective', 'gec->gec', 'special'];
let currentTaskTypeSequenceIndex = 0;
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
const getNextPendingTask = () => {
  let initialTaskTypeSequenceIndex = currentTaskTypeSequenceIndex;

  // Try to find a non-empty queue
  do {
    const type = taskTypeSequences[currentTaskTypeSequenceIndex];
    if (taskTypeQueues[type] && taskTypeQueues[type].length > 0) {
      const task = taskTypeQueues[type].shift();
      
      // Ensure prerequisites are met
      const prereqsMet = task.prerequisites.every(prereqId => assignedTasks.data.some(t => t.id === prereqId && t.status === 'completed'));

      // Ensure corequisites are included in the same chunk
      const coreqsIncluded = task.corequisites.every(coreqId => currentChunk.some(t => t.id === coreqId));

      if (prereqsMet && coreqsIncluded) {
        currentTaskTypeSequenceIndex = (currentTaskTypeSequenceIndex + 1) % taskTypeSequences.length;
        return task;
      } else {
        // If prerequisites or corequisites are not met, put the task back in the queue
        taskTypeQueues[type].push(task);
      }
    }
    currentTaskTypeSequenceIndex = (currentTaskTypeSequenceIndex + 1) % taskTypeSequences.length;
  } while (currentTaskTypeSequenceIndex !== initialTaskTypeSequenceIndex);

  return null; // Return null if no more tasks are found
};

// Function to get the maximum allowed gec->gec tasks based on chunk count
const getMaxGecGecForCurrentChunk = () => {
  if (chunkTables.length <= 1) return 3; // Semesters 1 & 2
  if (chunkTables.length <= 3) return 2; // Semesters 3 & 4
  return 1; // Semester 5 and above
};

// Process pending tasks based on task_type and gec_type
currentChunk = [];
currentUnits = 0;
let task = getNextPendingTask();
let gecGecCount = 0;

while (task) {
  if (task.task_type === 'gec' && task.gec_type === 'gec') {
    if (gecGecCount >= getMaxGecGecForCurrentChunk()) {
      // If max gec->gec limit is reached, skip to the next task
      task = getNextPendingTask();
      continue;
    }
    gecGecCount += 1;
  }

  currentChunk.push(task);
  currentUnits += task.units;

  // Handle corequisites: ensure all corequisites are in the same chunk
  task.corequisites.forEach(coreqId => {
    const coreqTask = assignedTasks.data.find(t => t.id === coreqId && t.status === 'pending');
    if (coreqTask) {
      currentChunk.push(coreqTask);
      currentUnits += coreqTask.units;
      assignedTasks.data = assignedTasks.data.filter(t => t.id !== coreqId);
    }
  });

  // If max_units reached, push the chunk and reset counters
  if (currentUnits >= maxUnits) {
    chunkTables.push(currentChunk);
    currentChunk = [];
    currentUnits = 0;
    gecGecCount = 0; // Reset gec->gec count for the next chunk
  }

  // Get the next task based on task_type and gec_type in a round-robin fashion
  task = getNextPendingTask();
}

// Push the remaining tasks, if any
if (currentChunk.length > 0) {
  chunkTables.push(currentChunk);
}

// Separate remaining tasks (standing, gec->gee) into the last table chunk
const remainingTasks = currentChunkPending.filter((task) => {
  return !((task.task_type === 'gec' && (task.gec_type === 'elective' || task.gec_type === 'gec')) || task.task_type === 'special');
});

if (remainingTasks.length > 0) {
  chunkTables.push(remainingTasks);
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Hi! Welcome
          </h2>
        </div>
      }
    >
      <Head title="Task" />
      
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
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                      <tr className="text-nowrap">
                        <th className="px-3 py-3">ID</th>
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
                      </tr>
                    </thead>
                    <tbody>
                      {chunk.map((assignedTask) => (
                        <tr
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                          key={assignedTask.id}
                        >
                          <td className="px-3 py-2">{assignedTask.id}</td>
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
