import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Create({ auth, allTask, prerequisites, corequisites }) {
  const { data, setData, post, errors, reset } = useForm({
    //image_path: "", // Updated variable name
    name: "",
    task_type: "",
    gec_type: "",
    //description: "",
    prerequisite: "",
    corequisite: "",
    prerequisite_id: "",
    corequisite_id: "",
    course_code: "",
  });

  const onSubmit = (e) => {
      console.log(data);
    e.preventDefault();
    post(route("allTask.store"));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Create new Task
          </h2>
        </div>
      }
    >
      <Head title="All Tasks" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <form
              onSubmit={onSubmit}
              className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg"
            >
                {/* <div>
                <InputLabel htmlFor="task_project_id" value="Project" />

                <SelectInput
                  name="project_id"
                  id="task_project_id"
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
              </div> */}
              
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
              </div>
              {/* <div className="mt-4">
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
              </div> */}

              <div className="mt-4">
                <InputLabel
                  htmlFor="prerequisite"
                  value="Assigned Prerequisite"
                />

                <SelectInput
                  name="prerequisite_id"
                  id="prerequisite"
                  className="mt-1 block w-full"
                  onChange={(e) => setData("prerequisite_id", e.target.value)}
                >
                  <option value="">Select prerequisite</option>
                  {allTask.data.map((allTask) => (
                    <option value={allTask.id} key={allTask.id}>
                      {allTask.name}
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
                  className="mt-1 block w-full"
                  onChange={(e) => setData("corequisite_id", e.target.value)}
                >
                  <option value="">Select corequisite</option>
                  {allTask.data.map((allTask) => (
                    <option value={allTask.id} key={allTask.id}>
                      {allTask.name}
                    </option>
                  ))}
                </SelectInput>

                <InputError
                  message={errors.corequisite_id}
                  className="mt-2"
                />
              </div>

              <div className="mt-4">
                <InputLabel htmlFor="TaskType" value="Task Type" />

                <SelectInput
                  name="task_type"
                  id="TaskType"
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
                <InputLabel htmlFor="gectype" value="gec Type" />

                <SelectInput
                  name="gec_type"
                  id="gectype"
                  className="mt-1 block w-full"
                  onChange={(e) => setData("gec_type", e.target.value)}
                >
                  <option value="">Select GEC Type</option>
                  <option value="gec">GEC</option>
                  <option value="elective">ELECTIVE</option>
                  <option value="gee">GEE</option>
                </SelectInput>

                <InputError message={errors.gec_type} className="mt-2" />
              </div>

              <div className="mt-4">
                <InputLabel htmlFor="course_code" value="Course Code" />

                <TextInput
                  id="course_code"
                  type="text"
                  name="course_code"
                  value={data.course_code}
                  className="mt-1 block w-full"
                  isFocused={true}
                  onChange={(e) => setData("course_code", e.target.value)}
                />

                <InputError message={errors.course_code} className="mt-2" />
              </div>

              <div className="mt-4 text-right">
                <Link
                  href={route("allTask.index")}
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
