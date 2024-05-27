import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Create({ auth, allTasks }) {
  const { data, setData, post, errors, reset } = useForm({
    name: "",
    status: "",
    selectedTasks: [],

    image_path: "", // Updated variable name
    task_type: "",
    gec_type: "",
    description: "",
    prerequisite: "",
    corequisite: "",
    prerequisite_id: "",
    corequisite_id: "",
    project_id: "",
  });

  const handleTaskCheckboxChange = (task) => {
        const isSelected = data.selectedTasks.includes(task.id);
        if (isSelected) {
          setData("selectedTasks", data.selectedTasks.filter((id) => id !== task.id));
        } else {
          setData("selectedTasks", [...data.selectedTasks, task.id]);
        }
      };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(data.selectedTasks); // Check the values here
    post(route("project.store"), {
      data,
      onSuccess: () => {
        reset();
      },
    });
  };



  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Create new Project
          </h2>
        </div>
      }
    >
      <Head title="Projects" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <form
              onSubmit={onSubmit}
              className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg"
            >
              <div className="mt-4">
                <InputLabel htmlFor="project_name" value="Project Name" />

                <TextInput
                  id="project_name"
                  type="text"
                  name="name"
                  value={data.name}
                  className="mt-1 block w-full"
                  isFocused={true}
                  onChange={(e) => setData("name", e.target.value)}
                />

                <InputError message={errors.name} className="mt-2" />
              </div>
              <div className="mt-4">
                <InputLabel htmlFor="project_status" value="Project Status" />

                <SelectInput
                  name="status"
                  id="project_status"
                  className="mt-1 block w-full"
                  onChange={(e) => setData("status", e.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </SelectInput>

                <InputError message={errors.project_status} className="mt-2" />
              </div>

              <div className="mt-4">
                <InputLabel value="Select Tasks" />
                <div className="p-6 text-gray-900 dark:text-gray-100">
                <ul>
                  {allTasks.data.map((allTask) => (
                    <li key={allTask.id}>
                      <input
                        type="checkbox"
                        id={`task_${allTask.id}`}
                        name={`task_${allTask.id}`}
                        checked={data.selectedTasks.includes(allTask.id)}
                        onChange={() => handleTaskCheckboxChange(allTask)}
                      />
                      <label htmlFor={`task_${allTask.id}`}>{allTask.name}</label>
                    </li>
                  ))}
                </ul>
                </div>
              </div>

              <div className="mt-4">
                <InputLabel value="Selected Task IDs" />
                <div className="p-6 text-gray-900 dark:text-gray-100">
                  <ul>
                    {data.selectedTasks.map((taskId) => (
                      <li key={taskId}>{taskId}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 text-right">
                <Link
                  href={route("project.index")}
                  className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2"
                >
                  Cancel
                </Link>
                <button className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
