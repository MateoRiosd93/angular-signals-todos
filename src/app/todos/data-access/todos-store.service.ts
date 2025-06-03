import { computed, inject, Injectable, signal } from "@angular/core";
import { TodosService } from "./todos-api.service";
import { Todo } from "../models/todo";

interface TodosState {
    todos: Todo[]
    loading: boolean
    error: boolean
}

@Injectable({providedIn: 'root'})
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

    // Acciones del store
    getAllTodos(){
        this.state.update(state => ({...state, loading: true}))

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

    
}