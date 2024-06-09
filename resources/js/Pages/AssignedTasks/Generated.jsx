import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PROJECT_STATUS_CLASS_MAP, PROJECT_STATUS_TEXT_MAP } from "@/constants.jsx";
import { Link, router } from "@inertiajs/react";

export default function Generated({ auth, success, assignedTasks, queryParams = null, projects, users, studentprojects }) {
  queryParams = queryParams || {};

  // Count the number of each status type
  const statusCounts = {
    pending: 0,
    in_progress: 0,
    completed: 0,
    null: 0
  };

  assignedTasks.data.forEach((task) => {
    statusCounts[task.status ?? "null"]++;
  });

  // Define the number of rows per chunk based on the count of each status type
  const rowsPerChunk = Math.max(...Object.values(statusCounts));

  // Slice the assignedTasks data into chunks based on status
  const chunks = {};
  Object.keys(statusCounts).forEach((status) => {
    chunks[status] = [];
    for (let i = 0; i < assignedTasks.data.length; i++) {
      const task = assignedTasks.data[i];
      if (task.status === status || (status === "null" && !task.status)) {
        chunks[status].push(task);
      }
    }
  });

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Hi ! Welcome
          </h2>
        </div>
      }
    >
      <Head title="Task" />
      
      {/* Render each chunk as a separate table */}
      {Object.keys(chunks).map((status, index) => (
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
                        <th className="px-3 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chunks[status].map((assignedTask) => (
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
                          <td className="px-3 py-2 text-nowrap">{assignedTask.start_time}</td>
                          <td className="px-3 py-2 text-nowrap">{assignedTask.end_time}</td>
                          <td className="px-3 py-2 text-nowrap">
                            <Link
                              href={route("assignedTasks.edit", assignedTask.id)}
                              className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1"
                            >
                              Edit Status
                            </Link>
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

