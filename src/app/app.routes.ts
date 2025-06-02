import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'todos',
        loadChildren: () => import('./todos/features/data-shell/todos.routing')
            .then(module => module.routes)
    }
];
