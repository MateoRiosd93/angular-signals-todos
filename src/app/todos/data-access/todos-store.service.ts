import { computed, inject, Injectable, signal } from "@angular/core";
import { TodosService } from "./todos-api.service";
import { Todo } from "../models/todo";

interface TodosState {
    todos: Todo[]
    loading: boolean
    error: boolean
}

@Injectable({ providedIn: 'root' })
export class TodosStore {
    private readonly todosService = inject(TodosService)

    // Creamos nuestro signal para manejar el state de los todos
    private readonly state = signal<TodosState>({
        todos: [],
        loading: false,
        error: false
    })

    // Creamos computed signals para acceder a las propiedades del state
    readonly todos = computed(() => this.state().todos)
    readonly loading = computed(() => this.state().loading)
    readonly error = computed(() => this.state().error)

    // Acciones para manipular el TodosStore
    getAllTodos() {
        this.state.update(state => ({ ...state, loading: true }))

        this.todosService.getAllTodos().subscribe({
            next: todos => {
                this.state.update(state => ({
                    ...state,
                    loading: false,
                    todos
                }))
            },
            error: error => {
                this.state.update(state => ({
                    ...state,
                    error: true
                }))

                console.error(error)
            }
        })
    }

    createTodo(todo: Todo) {
        this.todosService.createTodo(todo).subscribe({
            next: todo => {
                this.state.update(state => ({
                    ...state,
                    todos: [...state.todos, todo]
                }))
            },
            error: error => {
                this.state.update(state => ({
                    ...state,
                    error: true
                }))

                console.error(error)
            }
        })
    }

    deleteTodo(id: number) {
        this.todosService.deleteTodo(id).subscribe({
            next: () => {
                const todos = this.state().todos.filter(todo => todo.id !== id)

                this.state.update(state => ({
                    ...state,
                    todos
                }))
            },
            error: error => {
                this.state.update(state => ({
                    ...state,
                    error: true
                }))

                console.error(error)
            }
        })
    }

    editTodo(todo: Todo) {
        this.todosService.editTodo(todo).subscribe({
            next: response => {
                console.log(response);

                const newTodos = this.state().todos.map(element => {
                    if (element.id === response.id) {
                        return {
                            ...response
                        }
                    }
                    return element
                })

                this.state.update(state => ({
                    ...state,
                    todos: [...newTodos]
                }))
            },
            error: error => {
                this.state.update(state => ({
                    ...state,
                    error: true
                }))

                console.error(error)
            }
        })
    }
}