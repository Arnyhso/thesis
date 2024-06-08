import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import { Head, Link } from "@inertiajs/react";

import ScheduleTable from "./ScheduleTable";

export default function Index({ auth, success, tasks, projects, task, queryParams = null }) {
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Schedule
          </h2>
          <Link
            href={route("task.index")}
            className="bg-amber-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-amber-600"
          >
            Go back
          </Link>
          {/* <Link
            href={route("task.Scheduleedit")}
            className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600"
          >
            Add new schedule
          </Link> */}
        </div>
      }
    >
      <Head title="Task" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <ScheduleTable
                task={task}
                tasks={tasks}
                queryParams={queryParams}
                success={success}
                projects={projects}
              />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}