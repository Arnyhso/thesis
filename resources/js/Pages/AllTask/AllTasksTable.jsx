import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import TableHeading from "@/Components/TableHeading";
import { TASK_PRIORITY_CLASS_MAP, TASK_PRIORITY_TEXT_MAP, TASK_STATUS_CLASS_MAP, TASK_STATUS_TEXT_MAP } from "@/constants.jsx";
import { Link, router } from "@inertiajs/react";

export default function AllTasksTable({
  allTasks,
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

    router.get(route("allTask.index"), queryParams);
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
    router.get(route("allTask.index"), queryParams);
  };

  const deleteTask = (allTask) => {
    if (!window.confirm("Are you sure you want to delete the task?")) {
      return;
    }
    router.delete(route("allTask.destroy", allTask.id));
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
              <TableHeading
                name="id"
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                ID
              </TableHeading>
              <th className="px-3 py-3">Image</th>
              <TableHeading
                name="course_code"
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                Course Code
              </TableHeading>
              <TableHeading
                name="name"
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                Subject Name
              </TableHeading>

              <TableHeading
                name="units"
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                Units
              </TableHeading>

              <th className="px-3 py-3">Subject type</th>
              <th className="px-3 py-3">GEC type</th>
              <th className="px-3 py-3">Prerequisite</th>
              <th className="px-3 py-3">Corequisite</th>
              <th className="px-3 py-3 text-right">Actions</th>
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
                  placeholder="Task Name"
                  onBlur={(e) => searchFieldChanged("name", e.target.value)}
                  onKeyPress={(e) => onKeyPress("name", e)}
                />
              </th>
              <th className="px-3 py-3">
                <TextInput
                  className="w-full"
                  defaultValue={queryParams.units}
                  placeholder="Units"
                  onBlur={(e) => searchFieldChanged("units", e.target.value)}
                  onKeyPress={(e) => onKeyPress("units", e)}
                />
              </th>
              <th className="px-3 py-3">
                <SelectInput
                  className="w-full"
                  defaultValue={queryParams.task_type}
                  onChange={(e) => searchFieldChanged("task_type", e.target.value)}
                >
                  <option value="">Select Task Type</option>
                  <option value="gec">GEC</option>
                  <option value="special">SPECIAL</option>
                  <option value="standing">STANDING</option>
                </SelectInput>
              </th>
              <th className="px-3 py-3"></th>
              <th className="px-3 py-3"></th>
              <th className="px-3 py-3"></th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {allTasks.data.map((allTask) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                key={allTask.id}
              >
                <td className="px-3 py-2">{allTask.id}</td>
                <td className="px-3 py-2">
                  <img src={allTask.image_path} style={{ width: 60 }} />
                </td>
                <td className="px-3 py-2">{allTask.course_code}</td>
                <th className="px-3 py-2 text-gray-100 hover:underline">
                  <Link href={route("allTask.show", allTask.id)}>{allTask.name}</Link>
                </th>
                <td className="px-3 py-2">{allTask.units}</td>
                <td className="px-3 py-2">
                  <span
                    className={
                      "px-2 py-1 rounded text-nowrap text-white " +
                      TASK_STATUS_CLASS_MAP[allTask.task_type]
                    }
                  >
                    {TASK_STATUS_TEXT_MAP[allTask.task_type]}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span
                    className={
                      "px-2 py-1 rounded text-nowrap text-white " +
                      TASK_PRIORITY_CLASS_MAP[allTask.gec_type]
                    }
                  >
                    {TASK_PRIORITY_TEXT_MAP[allTask.gec_type]}
                  </span>
                </td>
                <td className="px-3 py-2 text-nowrap">{getTaskName(allTask.prerequisite_id)}</td>
                <td className="px-3 py-2 text-nowrap">{getTaskName(allTask.prerequisite_id)}</td>
                <td className="px-3 py-2 text-nowrap">
                  <Link
                    href={route("allTask.edit", allTask.id)}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={(e) => deleteTask(allTask)}
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
      <Pagination links={allTasks.meta.links} />
    </>
  );
}
