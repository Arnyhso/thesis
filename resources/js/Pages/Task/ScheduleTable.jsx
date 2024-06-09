import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import TableHeading from "@/Components/TableHeading";
import { Link, router } from "@inertiajs/react";

export default function ScheduleTable({
  tasks,
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
              {/* <th className="px-3 py-3">Image</th> */}
              {!hideProjectColumn && (
                <th className="px-3 py-3">Course Program</th>
              )}
              <TableHeading
                name="name"
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                Subject Description
              </TableHeading>
              <TableHeading
                name="prof_name"
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                Professor Name
              </TableHeading>
              <TableHeading
                name="room_num"
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                Room
              </TableHeading>
              <TableHeading
                name="day"
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                Day
              </TableHeading>
              <TableHeading
                name="start_time"
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                Start Time
              </TableHeading>
              <TableHeading
                name="end_time"
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                End Time
              </TableHeading>
              <th className="px-3 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.data.map((task) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                key={task.id}
              >
                <td className="px-3 py-2">{getProjectName(task.project_id)}</td>
                <th className="px-3 py-2 text-gray-100 hover:underline">
                  <Link href={route("task.show", task.id)}>{task.name}</Link>
                </th>
                <td className="px-3 py-2 text-nowrap">{task.prof_name}</td>
                <td className="px-3 py-2 text-nowrap">{task.room_num}</td>
                <td className="px-3 py-2 text-nowrap">{task.day}</td>
                <td className="px-3 py-2 text-nowrap">{task.start_time}</td>
                <td className="px-3 py-2 text-nowrap">{task.end_time}</td>
                <td className="px-3 py-2 text-nowrap">
                  <Link
                    href={route("task.scheduleedit", task.id)}
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