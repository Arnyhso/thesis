import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import TableHeading from "@/Components/TableHeading";
import { PROJECT_STATUS_CLASS_MAP, PROJECT_STATUS_TEXT_MAP } from "@/constants.jsx";
import { Link, router } from "@inertiajs/react";
import { usePage } from '@inertiajs/react';

export default function AssignedTasksTable({
  projects,
  studentprojects,
  users,
  assignedTask,
  success,
  queryParams = null,
  hideProjectColumn = false,
}) {
  queryParams = queryParams || {};

  // Count the number of each status type
  const statusCounts = {
    pending: 0,
    in_progress: 0,
    completed: 0
    };

  assignedTask.data.forEach((task) => {
    statusCounts[task.status]++;
  });

  // Slice the assignedTasks data into chunks based on status
  const chunks = {};
  Object.keys(statusCounts).forEach((status) => {
    chunks[status] = assignedTask.data.filter(task => task.status === status);
  });

  const getUserName = (userId) => {
    const user = users.data.find((user) => user.id === userId);
    return user ? user.name : "N/A";
  };

  const updateStatus = (taskId, newStatus) => {
    router.put(route('assignedTasks.update', taskId), { status: newStatus });
  };

  return (
    <>
      {success && (
        <div className="bg-emerald-500 py-2 px-4 text-white rounded mb-4">
          {success}
        </div>
      )}
      {Object.keys(chunks).map((status, index) => (
        <div key={index} className="overflow-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
              <tr className="text-nowrap">
                <th className="px-3 py-3">Image</th>
                <th className="px-3 py-3">Subject Description</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Subject ID</th>
                <th className="px-3 py-3">Assigned_User</th>
                <th className="px-3 py-3">Subject Units</th>
                <th className="px-3 py-3">Max Units</th>
                <th className="px-3 py-3 text-right">Semester</th>
              </tr>
            </thead>
            <tbody>
              {chunks[status].map((assignedTask) => (
                <tr
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  key={assignedTask.id}
                >
                  <td className="px-3 py-2">
                    <img src={assignedTask.image_path} style={{ width: 60 }} />
                  </td>
                  <th className="px-3 py-2 text-gray-100 hover:underline">
                    <Link href={route("task.show", assignedTask.id)}>
                      {assignedTask.name}
                    </Link>
                  </th>
                  <td className="px-3 py-2">
                     <SelectInput
                        name={`status-${assignedTask.id}`}
                        value={assignedTask.status}
                        onChange={(e) => updateStatus(assignedTask.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </SelectInput>
                  </td>
                  <td className="px-3 py-2 text-nowrap">{assignedTask.course_code}</td>
                  <td className="px-3 py-2">{getUserName(assignedTask.assigned_user_id)}</td>
                  <td className="px-3 py-2 text-nowrap">{assignedTask.units}</td>
                  <td className="px-3 py-2 text-nowrap">{assignedTask.max_units}</td>
                  <td className="px-3 py-2 text-ce">{assignedTask.semester}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </>
  );
}
