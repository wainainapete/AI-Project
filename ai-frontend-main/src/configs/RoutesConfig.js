import React from 'react'
import { AUTH_PREFIX_PATH, APP_PREFIX_PATH } from 'configs/AppConfig'

export const publicRoutes = [
    {
        key: 'login',
        path: `${AUTH_PREFIX_PATH}/login`,
        component: React.lazy(() => import('views/auth-views/authentication/login')),
    },
    {
        key: 'register',
        path: `${AUTH_PREFIX_PATH}/register`,
        component: React.lazy(() => import('views/auth-views/authentication/register')),
    },
    {
        key: 'forgot-password',
        path: `${AUTH_PREFIX_PATH}/forgot-password`,
        component: React.lazy(() => import('views/auth-views/authentication/forgot-password')),
    }
]

export const protectedRoutes = [
    {
        key: 'dashboard.default',
        path: `${APP_PREFIX_PATH}/dashboards/default`,
        component: React.lazy(() => import('views/app-views/dashboards/default')),
    },
    {
        key: 'timesheet',
        path: `${APP_PREFIX_PATH}/views/mytimesheets`,
        component: React.lazy(() => import('views/app-views/tms/timesheet')),
    },
    {
        key: 'TimesheetForm',
        path: `${APP_PREFIX_PATH}/views/timesheet/TimesheetForm`,
        component: React.lazy(() => import('views/app-views/tms/timesheet/TimesheetForm')),
    },
    {
        key: 'users',
        path: `${APP_PREFIX_PATH}/views/users`,
        component: React.lazy(() => import('views/app-views/tms/employees')),
    },

    // Projects
    {
        key: "app.project.list",
        path: `${APP_PREFIX_PATH}/tms/project/list`,
        component: React.lazy(() =>
            import("views/app-views/tms/project/project-list")
        ),
    },

    {
        key: "app.project.view",
        path: `${APP_PREFIX_PATH}/project/details/*`,
        component: React.lazy(() =>
            import("views/app-views/tms/project/project-details")
        ),
    },

    {
        key: "app.project.view",
        path: `${APP_PREFIX_PATH}/tasks/*`,
        component: React.lazy(() =>
            import("views/app-views/tms/task")
        ),
    },
    
    {
        key: "app.task.list",
        path: `${APP_PREFIX_PATH}/task/list/*`,
        component: React.lazy(() =>
            import("views/app-views/tms/task/task-list")
        ),
    },

    {
        key: "app.task.view",
        path: `${APP_PREFIX_PATH}/task/view/*`,
        component: React.lazy(() =>
            import("views/app-views/tms/task/task-details")
        ),
    },

    // Employees
    {
        key: "app.employees",
        path: `${APP_PREFIX_PATH}/apps/employees/list/*`,
        component: React.lazy(() =>
            import("views/app-views/tms/task")
        ),
    },

    // Departments
    {
        key: "app.departments",
        path: `${APP_PREFIX_PATH}/apps/departments/list/*`,
        component: React.lazy(() =>
            import("views/app-views/tms/task")
        ),
    },
    {
        key: "ai search",
        path: `${APP_PREFIX_PATH}/ai-search/*`,
        component: React.lazy(() =>
            import("views/app-views/ecommerce/aichatplatform")
        ),
    }
];