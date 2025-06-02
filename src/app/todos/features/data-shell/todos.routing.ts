import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('../todo-list/todo-list.component')
            .then(component => component.TodoListComponent),
    },
    {
        path: '**',
        redirectTo: '',
    },
]