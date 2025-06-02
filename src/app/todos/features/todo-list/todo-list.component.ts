import { Component, inject, OnInit } from '@angular/core';
import { TodosStore } from '../../data-access/todos-store.service';

@Component({
    selector: 'app-todo-list',
    imports: [],
    templateUrl: './todo-list.component.html',
    styleUrl: './todo-list.component.css'
})
export class TodoListComponent implements OnInit {
    todosStore = inject(TodosStore)

    ngOnInit() {
        this.todosStore.getAllTodos()
    }

}
