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
  assignedTasks,
  success,
  queryParams = null,
  hideProjectColumn = false,
}) {

  queryParams = queryParams || {};

  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }

    router.get(route("assignedTasks.Planner"), queryParams);
  };

  const onKeyPress = (name, e) => {
    if (e.key !== "Enter") return;

    searchFieldChanged(name, e.target.value);
  };

  const sortChanged = (name) => {
    if (name === queryParams.sort_field) {
      if (queryParams.sort_direction === "asc") {
        queryParams.sort_direction = "desc";
      } else {
        queryParams.sort_direction = "asc";
      }
    } else {
      queryParams.sort_field = name;
      queryParams.sort_direction = "asc";
    }

    router.get(route("assignedTasks.Planner"), queryParams);
  };

  const getProjectName = (projectId) => {
    const project = studentprojects.data.find(project => project.id === projectId);
    return project ? project.name : "N/A";
  };


  const getUserName = (userId) => {
    const user = users.data.find((user) => user.id === userId);
    return user ? user.name : "N/A";
  };

  return (
    <>
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
              <th className="px-3 py-3">Project Name</th>
              <th className="px-3 py-3">Subject Name</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Course Code</th>
              <th className="px-3 py-3">Assigned_User</th>
              <th className="px-3 py-3">Subject Units</th>
              <th className="px-3 py-3">Max Units</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
          </thead>
          <tbody>
            {assignedTasks.data.map((assignedTask) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                key={assignedTask.id}
              >
                <td className="px-3 py-2">{assignedTask.id}</td>
                <td className="px-3 py-2">
                  <img src={assignedTask.image_path} style={{ width: 60 }} />
                </td>
                <td className="px-3 py-2">{getProjectName(assignedTask.project_id)}</td>
                <th className="px-3 py-2 text-gray-100 hover:underline">
                  <Link href={route("assignedTasks.show", assignedTask.id)}>{assignedTask.name}</Link>
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
                <td className="px-3 py-2">{getUserName(assignedTask.assigned_user_id)}</td>
                <td className="px-3 py-2 text-nowrap">{assignedTask.max_units}</td>
                <td className="px-3 py-2 text-nowrap">{assignedTask.units}</td>
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
    </>
  );
}
