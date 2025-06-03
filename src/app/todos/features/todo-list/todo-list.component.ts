import { Component, inject, OnInit } from '@angular/core';
import { TodosStore } from '../../data-access/todos-store.service';
import { ReactiveFormsModule, FormBuilder, FormControl, Validators } from '@angular/forms'
import { Todo } from '../../models/todo';

interface TodoForm {
    title: FormControl<string>
}

@Component({
    selector: 'app-todo-list',
    imports: [ReactiveFormsModule],
    templateUrl: './todo-list.component.html',
    styleUrl: './todo-list.component.css'
})
export class TodoListComponent implements OnInit {
    todosStore = inject(TodosStore)
    formBuilder = inject(FormBuilder)

    form = this.formBuilder.group<TodoForm>({
        title: this.formBuilder.control('', { nonNullable: true, validators: [Validators.required] })
    })

    isEditTodo: boolean = false
    todoEdit: Todo = {} as Todo

    ngOnInit() {
        this.todosStore.getAllTodos()
    }

    checkTodo(id: number) {
        console.log(`${id} a completar`)
    }

    createTodo() {
        if (this.form.invalid) return

        const newTodo: Todo = {
            userId: 1,
            id: this.todoEdit.id ?? this.todosStore.todos().length + 1,
            title: this.form.value.title ?? '',
            completed: this.todoEdit.completed ?? false
        }

        this.form.reset()

        if(this.isEditTodo){
            this.todosStore.editTodo(newTodo)
            this.isEditTodo = false
            this.todoEdit = {} as Todo
            return
        }

        this.todosStore.createTodo(newTodo)
    }

    loadTodoForEdit(todo: Todo){
        this.form.patchValue({
            title: todo.title
        })

        this.isEditTodo = true
        this.todoEdit = todo
    }
}
