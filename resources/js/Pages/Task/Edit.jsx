import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Edit({ auth, task, projects, projectTasks }) {
  const { data, setData, post, errors, reset } = useForm({
    image: "",
    name: task.name || "",
    task_type: task.task_type || "",
    gec_type: task.gec_type || "",
    description: task.description || "",
    project_id: task.project_id || "",
    prerequisite_id: task.prerequisite_id || "",
    prerequisite: task.prerequisite || "",
    corequisite_id: task.corequisite_id || "",
    corequisite: task.corequisite || "",
    //course_code: task.course_code || "",
    _method: "PUT",
  });

  const onSubmit = (e) => {
    e.preventDefault();

    post(route("task.update", task.id));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Edit task "{task.name}"
          </h2>
        </div>
      }
    >
      <Head title="Tasks" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <form
              onSubmit={onSubmit}
              className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg"
            >
              {task.image_path && (
                <div className="mb-4">
                  <img src={task.image_path} className="w-64" />
                </div>
              )}
              <div>
                <InputLabel 
                htmlFor="task_project_id" 
                value="Project"
                />

                <SelectInput
                  name="project_id"
                  id="task_project_id"
                  value={data.project_id}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("project_id", e.target.value)}
                >
                  <option value="">Select Project</option>
                  {projects.data.map((project) => (
                    <option value={project.id} key={project.id}>
                      {project.name}
                    </option>
                  ))}
                </SelectInput>

                <InputError message={errors.project_id} className="mt-2" />
              </div>
              <div className="mt-4">
                <InputLabel htmlFor="task_image_path" value="Task Image" />
                <TextInput
                  id="task_image_path"
                  type="file"
                  name="image"
                  className="mt-1 block w-full"
                  onChange={(e) => setData("image", e.target.files[0])}
                />
                <InputError message={errors.image} className="mt-2" />
              </div>
              <div className="mt-4">
                <InputLabel 
                htmlFor="task_name" 
                value="Task Name" 
                />

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
              </div>
              <div className="mt-4">
                <InputLabel
                  htmlFor="task_description"
                  value="Task Description"
                />

                <TextAreaInput
                  id="task_description"
                  name="description"
                  value={data.description}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("description", e.target.value)}
                />

                <InputError message={errors.description} className="mt-2" />
              </div>
              <div className="mt-4">
                <InputLabel
                  htmlFor="TaskType"
                  value="Task Type"
                />

                <SelectInput
                  name="task_type"
                  id="TaskType"
                  value={data.task_type}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("task_type", e.target.value)}
                >
                  <option value="">Select Task Type</option>
                  <option value="gec">GEC</option>
                  <option value="special">SPECIAL</option>
                  <option value="standing">STANDING</option>
                </SelectInput>

                <InputError message={errors.task_type} className="mt-2" />
              </div>

              <div className="mt-4">
                <InputLabel
                  htmlFor="gectype"
                  value="gec Type"
                />

                <SelectInput
                  name="gec_type"
                  id="gectype"
                  value={data.gec_type}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("gec_type", e.target.value)}
                >
                  <option value="">Select Priority</option>
                  <option value="gec">GEC</option>
                  <option value="elective">ELECTIVE</option>
                  <option value="gee">GEE</option>
                </SelectInput>

                <InputError message={errors.gec_type} className="mt-2" />
              </div>

              <div className="mt-4">
                <InputLabel
                  htmlFor="prerequisite"
                  value="Assigned Prerequisite"
                />

                <SelectInput
                  name="prerequisite_id"
                  id="prerequisite"
                  value={data.prerequisite_id}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("prerequisite_id", e.target.value)}
                >
                  <option value="">Select prerequisite</option>
                  {projectTasks.data.map((task) => (
                    <option value={task.id} key={task.id}>
                      {task.name}
                    </option>
                  ))}
                </SelectInput>

                <InputError
                  message={errors.prerequisite_id}
                  className="mt-2"
                />
              </div>

              <div className="mt-4">
                <InputLabel
                  htmlFor="corequisite"
                  value="Assigned Corequisite"
                />

                <SelectInput
                  name="corequisite_id"
                  id="corequisite"
                  value={data.corequisite_id}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("corequisite_id", e.target.value)}
                >
                  <option value="">Select corequisite</option>
                  {projectTasks.data.map((task) => (
                    <option value={task.id} key={task.id}>
                      {task.name}
                    </option>
                  ))}
                </SelectInput>

                <InputError
                  message={errors.corequisite_id}
                  className="mt-2"
                />
              </div>

              {/* <div className="mt-4">
                <InputLabel
                  htmlFor="task_course_code"
                  value="Course Code"
                />

                <TextInput
                  id="task_course_code"
                  type="text"
                  name="course_code"
                  value={data.course_code}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("course_code", e.target.value)}
                />

                <InputError
                  message={errors.course_code}
                  className="mt-2"
                />
              </div> */}


              <div className="mt-4 text-right">
                <Link
                  href={route("task.index")}
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
