import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Student({ auth, task, projects, users, assignedTasks }) {
  const { data, setData, post, errors, reset } = useForm({
    name: "",
    course_code: "",
    task_type: "",
    gec_type: "",
    prerequisite_id: "",
    corequisite_id: "",
    units: "",
    description: "",
    image_path: null,
    project_id: "",
    prof_name: "",
    room_num: "",
    day: "",
    start_time: "",
    end_time: "",
    status: "",
    priority: "",
    max_units: "",
    assigned_user_id: "",
    semester: "",
    selectedTasks: [],
  });

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(data);
    post(route("project.studentStore"), {
      data,
      onSuccess: () => {
        reset();
      },
    });
  };

  const handleProjectChange = (projectId) => {
  setData("project_id", projectId);

  const selectedTasks = [];
  
  const projectIdInt = parseInt(projectId);

  // Iterate through all tasks
    task.data.forEach((task) => {

        const taskProjectIdInt = parseInt(task.project_id);
        // Check if the task's project_id matches the selected project's projectId
        if (taskProjectIdInt === projectIdInt) {
        // If yes, add the task's id to the selectedTasks array
        selectedTasks.push(task.id);
        }
    });
    // Set the selectedTasks array in the form data
    setData("selectedTasks", selectedTasks);
    };

    const studentUsers = users.data.filter((user) => user.user_type === "student");
    

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Create new Course
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
              <div>
                <InputLabel htmlFor="project_id" value="Course name" />

                <SelectInput
                  name="project_id"
                  id="project_id"
                  type="number"
                  className="mt-1 block w-full"
                  onChange={(e) => handleProjectChange(e.target.value)}
                >
                  <option value="">Select Course</option>
                  {projects.data.map((project) => (
                    <option value={project.id} key={project.id}>
                      {project.name}
                    </option>
                  ))}
                </SelectInput>

                <InputError message={errors.project_id} className="mt-2" />
              </div>

                <div className="mt-4">
                <InputLabel value="Selected Subject IDs" />
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        {data.selectedTasks.length === 0 ? (
                        <p>No Subjects selected</p>
                        ) : (
                        <ul>
                            {data.selectedTasks.map((taskId) => (
                            <li key={taskId}>{taskId}</li>
                            ))}
                        </ul>
                        )}
                    </div>
                </div>


              <div className="mt-4">
                <InputLabel htmlFor="max_units" value="Max Units" />
                <TextInput
                  id="max_units"
                  type="number"
                  name="max_units"
                  value={data.max_units}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("max_units", e.target.value)}
                />
                <InputError message={errors.max_units} className="mt-2" />
              </div>

              <div className="mt-4">
                <InputLabel htmlFor="status" value="Course Status" />
                <SelectInput
                  name="status"
                  id="status"
                  className="mt-1 block w-full"
                  onChange={(e) => setData("status", e.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </SelectInput>
                <InputError message={errors.status} className="mt-2" />
              </div>
{/* 
              <div className="mt-4">
                <InputLabel htmlFor="task_name" value="Task Name" />
                <TextInput
                  id="task_name"
                  type="text"
                  name="name"
                  value={data.name}
                  className="mt-1 block w-full"
                  isFocused={true}
                  onChange={(e) => setData("name", e.target.value)}
                />
                <InputError message={errors.name} className="mt-2" />
              </div> */}

              <div className="mt-4">
                <InputLabel htmlFor="assigned_user_id" value="Assigned User" />
                <SelectInput
                  name="assigned_user_id"
                  id="assigned_user_id"
                  className="mt-1 block w-full"
                  onChange={(e) => setData("assigned_user_id", e.target.value)}
                >
                  <option value="">Select User</option>
                 {studentUsers.map((user) => (
                    <option value={user.id} key={user.id}>
                      {user.name}
                    </option>
                  ))}
                </SelectInput>
                <InputError message={errors.assigned_user_id} className="mt-2" />
              </div>

              <div className="mt-4">
                <InputLabel htmlFor="semester" value="Semester" />
                <TextInput
                  id="semester"
                  type="number"
                  name="semester"
                  value={data.semester}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("semester", e.target.value)}
                />
                <InputError message={errors.semester} className="mt-2" />
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
