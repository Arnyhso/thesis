import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function ScheduleEdit({ auth, task, projects }) {
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
    units: task.units || "",
    prof_name: task.prof_name || "",
    room_num: task.room_num || "",
    day: task.day || "",
    start_time: task.start_time || "",
    end_time: task.end_time || "",
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
                <InputLabel htmlFor="prof_name" value="Professor Name" />
                <TextInput
                  id="prof_name"
                  type="text"
                  name="prof_name"
                  value={data.prof_name}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("prof_name", e.target.value)}
                />
                <InputError message={errors.prof_name} className="mt-2" />
              </div>
              <div className="mt-4">
                <InputLabel htmlFor="room_num" value="Room Number" />
                <TextInput
                  id="room_num"
                  type="text"
                  name="room_num"
                  value={data.room_num}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("room_num", e.target.value)}
                />
                <InputError message={errors.room_num} className="mt-2" />
              </div>
              <div className="mt-4">
                <InputLabel htmlFor="day" value="Day" />
                <SelectInput
                  name="day"
                  id="day"
                  value={data.day}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("day", e.target.value)}
                >
                  <option value="">Select Day</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </SelectInput>
                <InputError message={errors.day} className="mt-2" />
              </div>
              <div className="mt-4">
                <InputLabel htmlFor="start_time" value="Start Time" />
                <TextInput
                  id="start_time"
                  type="time"
                  name="start_time"
                  value={data.start_time}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("start_time", e.target.value)}
                />
                <InputError message={errors.start_time} className="mt-2" />
              </div>
              <div className="mt-4">
                <InputLabel htmlFor="end_time" value="End Time" />
                <TextInput
                  id="end_time"
                  type="time"
                  name="end_time"
                  value={data.end_time}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("end_time", e.target.value)}
                />
                <InputError message={errors.end_time} className="mt-2" />
              </div>
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
