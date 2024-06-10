import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import TableHeading from "@/Components/TableHeading";
import { TASK_PRIORITY_CLASS_MAP, TASK_PRIORITY_TEXT_MAP, TASK_STATUS_CLASS_MAP, TASK_STATUS_TEXT_MAP } from "@/constants.jsx";
import { Link, router } from "@inertiajs/react";

export default function TasksTable({
  tasks,
  allTasks,
  projects,
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

    router.get(route("task.index"), queryParams);
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
    router.get(route("task.index"), queryParams);
  };

  const deleteTask = (task) => {
    if (!window.confirm("Are you sure you want to delete the task?")) {
      return;
    }
    router.delete(route("task.destroy", task.id));
  };

  const getProjectName = (projectId) => {
    const project = projects.data.find(project => project.id === projectId);
    return project ? project.name : "N/A";
  };

  const getTaskName = (taskId) => {
    const task = allTasks.data.find(task => task.id === taskId);
    return task ? task.course_code : "";
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
              <th className="px-3 py-3"></th>
              <th className="px-3 py-3">Image</th>
                <th className="px-3 py-3">Student Name</th>
              <TableHeading
                name="name"
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                Subject Description
              </TableHeading>
              <th className="px-3 py-3">Subject Type</th>
              <th className="px-3 py-3">GEC Type</th>
              <th className="px-3 py-3">Prerequisite</th>
              <th className="px-3 py-3">Corequisite</th>
              <th className="px-3 py-3 text-right">Actions</th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
            <tr className="text-nowrap">
              <th className="px-3 py-3"></th>
              <th className="px-3 py-3"></th>
              {!hideProjectColumn && <th className="px-3 py-3"></th>}
              <th className="px-3 py-3">
                <TextInput
                  className="w-full"
                  defaultValue={queryParams.name}
                  placeholder="Subject Description"
                  onBlur={(e) => searchFieldChanged("name", e.target.value)}
                  onKeyPress={(e) => onKeyPress("name", e)}
                />
              </th>
              <th className="px-3 py-3">
                <SelectInput
                  className="w-full"
                  defaultValue={queryParams.status}
                  onChange={(e) => searchFieldChanged("status", e.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </SelectInput>
              </th>
              <th className="px-3 py-3"></th>
              <th className="px-3 py-3"></th>
              <th className="px-3 py-3"></th>
              <th className="px-3 py-3"></th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {tasks.data.map((task) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                key={task.id}
                >
                <td className="px-3 py-2 text-nowrap"></td>
                <td className="px-3 py-2">
                  <img src={task.image_path} style={{ width: 60 }} />
                </td>
                  <td className="px-3 py-2">{getProjectName(task.project_id)}</td>
                <th className="px-3 py-2 text-gray-100 hover:underline">
                  <Link href={route("task.show", task.id)}>{task.name}</Link>
                </th>
                <td className="px-3 py-2">
                  <span
                    className={
                      "px-2 py-1 rounded text-nowrap text-white " +
                      TASK_STATUS_CLASS_MAP[task.task_type]
                    }
                  >
                    {TASK_STATUS_TEXT_MAP[task.task_type]}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span
                    className={
                      "px-2 py-1 rounded text-nowrap text-white " +
                      TASK_PRIORITY_CLASS_MAP[task.gec_type]
                    }
                  >
                    {TASK_PRIORITY_TEXT_MAP[task.gec_type]}
                  </span>
                </td>
                <td className="px-3 py-2 text-nowrap">{getTaskName(task.prerequisite_id)}</td>
                <td className="px-3 py-2 text-nowrap">{getTaskName(task.corequisite_id)}</td>
                <td className="px-3 py-2 text-nowrap">
                  <Link
                    href={route("task.edit", task.id)}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={(e) => deleteTask(task)}
                    className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination links={tasks.meta.links} />
    </>
  );
}
