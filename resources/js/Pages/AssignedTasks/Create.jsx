import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Create({ auth, projects, assignedTasks, users }) {
  const { data, setData, post, errors, reset } = useForm({
    name: "",
    course_code: "",
    task_type: "",
    gec_type: "",
    prerequisite_id: "",
    corequisite_id: "",
    units: "",
    description: "",
    image: null,
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
    assigned_by: auth.user.id,
    semester: "",
  });

  const onSubmit = (e) => {
    e.preventDefault();
    post(route("assignedTasks.store"), {
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
            Create new Task
          </h2>
        </div>
      }
    >
      <Head title="Assigned" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <form
              onSubmit={onSubmit}
              className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg"
            >
              <div>
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
                <InputLabel htmlFor="task_image" value="Task Image" />
                <TextInput
                  id="task_image"
                  type="file"
                  name="image"
                  className="mt-1 block w-full"
                  onChange={(e) => setData("image", e.target.files[0])}
                />
                <InputError message={errors.image} className="mt-2" />
              </div>

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

              <div className="mt-4">
                <InputLabel htmlFor="units" value="Units" />
                <TextInput
                  id="units"
                  type="number"
                  name="units"
                  value={data.units}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("units", e.target.value)}
                />
                <InputError message={errors.units} className="mt-2" />
              </div>

              <div className="mt-4">
                <InputLabel htmlFor="task_description" value="Task Description" />
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
                <InputLabel htmlFor="prerequisite" value="Assigned Prerequisite" />
                <SelectInput
                  name="prerequisite_id"
                  id="prerequisite"
                  className="mt-1 block w-full"
                  onChange={(e) => setData("prerequisite_id", e.target.value)}
                >
                  <option value="">Select prerequisite</option>
                  {assignedTasks.data.map((task) => (
                    <option value={task.id} key={task.id}>
                      {task.name}
                    </option>
                  ))}
                </SelectInput>
                <InputError message={errors.prerequisite_id} className="mt-2" />
              </div>

              <div className="mt-4">
                <InputLabel htmlFor="corequisite" value="Assigned Corequisite" />
                <SelectInput
                  name="corequisite_id"
                  id="corequisite"
                  className="mt-1 block w-full"
                  onChange={(e) => setData("corequisite_id", e.target.value)}
                >
                  <option value="">Select corequisite</option>
                  {assignedTasks.data.map((task) => (
                    <option value={task.id} key={task.id}>
                      {task.name}
                    </option>
                  ))}
                </SelectInput>
                <InputError message={errors.corequisite_id} className="mt-2" />
              </div>

              <div className="mt-4">
                <InputLabel htmlFor="task_type" value="Task Type" />
                <SelectInput
                  name="task_type"
                  id="task_type"
                  className="mt-1 block w-full"
                  onChange={(e) => setData("task_type", e.target.value)}
                >
                  <option value="">Select Task Type</option>
                  <option value="gec">GEC</option>
                  <option value="special">Special</option>
                  <option value="standing">Standing</option>
                </SelectInput>
                <InputError message={errors.task_type} className="mt-2" />
              </div>

              <div className="mt-4">
                <InputLabel htmlFor="gec_type" value="GEC Type" />
                <SelectInput
                  name="gec_type"
                  id="gec_type"
                  className="mt-1 block w-full"
                  onChange={(e) => setData("gec_type", e.target.value)}
                >
                  <option value="">Select GEC Type</option>
                  <option value="gec">GEC</option>
                  <option value="elective">Elective</option>
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
                  onChange={(e) => setData("course_code", e.target.value)}
                />
                <InputError message={errors.course_code} className="mt-2" />
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

              <div className="mt-4">
                <InputLabel htmlFor="status" value="Status" />
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

              <div className="mt-4">
                <InputLabel htmlFor="priority" value="Priority" />
                <TextInput
                  id="priority"
                  type="text"
                  name="priority"
                  value={data.priority}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("priority", e.target.value)}
                />
                <InputError message={errors.priority} className="mt-2" />
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
                <InputLabel htmlFor="assigned_user_id" value="Assigned User" />
                <SelectInput
                  name="assigned_user_id"
                  id="assigned_user_id"
                  className="mt-1 block w-full"
                  onChange={(e) => setData("assigned_user_id", e.target.value)}
                >
                  <option value="">Select User</option>
                  {users.data.map((user) => (
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
                  href={route("assignedTasks.index")}
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
