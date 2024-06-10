import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import {
  TASK_PRIORITY_CLASS_MAP,
  TASK_PRIORITY_TEXT_MAP,
  TASK_STATUS_CLASS_MAP,
  TASK_STATUS_TEXT_MAP,
} from "@/constants.jsx";
export default function Show({ auth, task, prerequisite, corequisite }) {
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {`Subject Description "${task.name}"`}
          </h2>
          <Link
            href={route("task.index")}
            className="bg-amber-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-amber-600"
          >
            Back
          </Link>
        </div>
      }
    >
      <Head title={`Subject "${task.name}"`} />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div>
              <img
                src={task.image_path}
                alt=""
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="grid gap-1 grid-cols-2 mt-2">
                <div>
                  <div className="mt-4">
                    <label className="font-bold text-lg">Subject Description</label>
                    <p className="mt-1">{task.name}</p>
                  </div>

                  <div className="mt-4">
                    <label className="font-bold text-lg">Units</label>
                    <p className="mt-1">{task.units}</p>
                  </div>

                  <div className="mt-4">
                    <label className="font-bold text-lg">Subject Type</label>
                    <p className="mt-1">
                      <span
                        className={
                          "px-2 py-1 rounded text-white " +
                          TASK_STATUS_CLASS_MAP[task.task_type]
                        }
                      >
                        {TASK_STATUS_TEXT_MAP[task.task_type]}
                      </span>
                    </p>
                  </div>

                  <div className="mt-4">
                    <label className="font-bold text-lg">Subject GEC Type</label>
                    <p className="mt-1">
                      <span
                        className={
                          "px-2 py-1 rounded text-white " +
                          TASK_PRIORITY_CLASS_MAP[task.gec_type]
                        }
                      >
                        {TASK_PRIORITY_TEXT_MAP[task.gec_type]}
                      </span>
                    </p>
                  </div>
                  <div className="mt-4">
                   <label className="font-bold text-lg">Prerequisite</label>
                   <p className="mt-1">
                    {prerequisite ? (
                      <Link href={route("task.show", prerequisite.id)} className="hover:underline">
                        {prerequisite.name}
                      </Link>
                    ) : (
                      "N/A"
                    )}
                    </p>
                   </div>
                  <div>
                      <div>
                        <label className="font-bold text-lg">Corequisite</label>
                        <p className="mt-1">
                          {corequisite ? (
                            <Link href={route("task.show", corequisite.id)} className="hover:underline">
                              {corequisite.name}
                            </Link>
                          ) : (
                            "N/A"
                          )}
                        </p>
                      </div>
                    </div>
                </div>
                <div>
                    <div className="mt-4">
                    <label className="font-bold text-lg">Professor Name</label>
                    <p className="mt-1">{task.prof_name}</p>
                  </div>
                  <div className="mt-4">
                    <label className="font-bold text-lg">Room Number</label>
                    <p className="mt-1">{task.room_num}</p>
                  </div>
                  <div className="mt-4">
                    <label className="font-bold text-lg">Day</label>
                    <p className="mt-1">{task.day}</p>
                  </div>
                  <div className="mt-4">
                    <label className="font-bold text-lg">Start Time</label>
                    <p className="mt-1">{task.start_time}</p>
                  </div>
                  <div className="mt-4">
                    <label className="font-bold text-lg">End Time</label>
                    <p className="mt-1">{task.end_time}</p>
                  </div>
                  <div className="mt-4">
                    <label className="font-bold text-lg">Project</label>
                    <p className="mt-1">
                      <Link
                        href={route("project.show", task.project.id)}
                        className="hover:underline"
                      >
                        {task.project.name}
                      </Link>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="font-bold text-lg">Task Description</label>
                <p className="mt-1">{task.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
