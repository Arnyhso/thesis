import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import {
  TASK_PRIORITY_CLASS_MAP,
  TASK_PRIORITY_TEXT_MAP,
  TASK_STATUS_CLASS_MAP,
  TASK_STATUS_TEXT_MAP,
} from "@/constants.jsx";
export default function Show({ auth, assignedTasks, prerequisite, corequisite }) {
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {`Subject Name "${assignedTasks.name}"`}
          </h2>
        </div>
      }
    >
      <Head title={`Task "${assignedTasks.name}"`} />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div>
              <img
                src={assignedTasks.image_path}
                alt=""
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="grid gap-1 grid-cols-2 mt-2">
                <div>
                  <div>
                    <label className="font-bold text-lg">Subject ID</label>
                    <p className="mt-1">{assignedTasks.id}</p>
                  </div>
                  <div className="mt-4">
                    <label className="font-bold text-lg">Subject Name</label>
                    <p className="mt-1">{assignedTasks.name}</p>
                  </div>

                  <div className="mt-4">
                    <label className="font-bold text-lg">Units</label>
                    <p className="mt-1">{assignedTasks.units}</p>
                  </div>

                  <div className="mt-4">
                    <label className="font-bold text-lg">Subject Type</label>
                    <p className="mt-1">
                      <span
                        className={
                          "px-2 py-1 rounded text-white " +
                          TASK_STATUS_CLASS_MAP[assignedTasks.task_type]
                        }
                      >
                        {TASK_STATUS_TEXT_MAP[assignedTasks.task_type]}
                      </span>
                    </p>
                  </div>

                  <div className="mt-4">
                    <label className="font-bold text-lg">Subject GEC Type</label>
                    <p className="mt-1">
                      <span
                        className={
                          "px-2 py-1 rounded text-white " +
                          TASK_PRIORITY_CLASS_MAP[assignedTasks.gec_type]
                        }
                      >
                        {TASK_PRIORITY_TEXT_MAP[assignedTasks.gec_type]}
                      </span>
                    </p>
                  </div>
                </div>
                <div>
                  <div className="mt-4">
                   <label className="font-bold text-lg">Prerequisite</label>
                   <p className="mt-1">
                    {prerequisite ? (
                      <Link href={route("assignedTasks.show", prerequisite.id)} className="hover:underline">
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
                            <Link href={route("assignedTasks.show", corequisite.id)} className="hover:underline">
                              {corequisite.name}
                            </Link>
                          ) : (
                            "N/A"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                    <label className="font-bold text-lg">Professor Name</label>
                    <p className="mt-1">{assignedTasks.prof_name}</p>
                  </div>
                  <div className="mt-4">
                    <label className="font-bold text-lg">Room Number</label>
                    <p className="mt-1">{assignedTasks.room_num}</p>
                  </div>
                  <div className="mt-4">
                    <label className="font-bold text-lg">Day</label>
                    <p className="mt-1">{assignedTasks.day}</p>
                  </div>
                  <div className="mt-4">
                    <label className="font-bold text-lg">Start Time</label>
                    <p className="mt-1">{assignedTasks.start_time}</p>
                  </div>
                  <div className="mt-4">
                    <label className="font-bold text-lg">End Time</label>
                    <p className="mt-1">{assignedTasks.end_time}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="font-bold text-lg">Task Description</label>
                <p className="mt-1">{assignedTasks.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
