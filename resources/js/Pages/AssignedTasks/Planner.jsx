import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import { Head, Link } from "@inertiajs/react";

import AssignedTasksTable from "./AssignedTasksTable";

export default function Planner({ auth, success, assignedTasks, queryParams = null, projects, users, studentprojects }) {
    
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Hi ! Welcome
          </h2>
          <Link
            href={route("assignedTasks.Generated")}
            className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600"
          >
            Generate Schedule
          </Link>
        </div>
      }
    >
      <Head title="Task" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <AssignedTasksTable
                studentprojects={studentprojects}
                projects={projects}
                users={users}
                assignedTasks={assignedTasks}
                queryParams={queryParams}
                success={success}
              />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
