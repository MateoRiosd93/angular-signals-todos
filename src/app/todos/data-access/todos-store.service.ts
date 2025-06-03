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

    private readonly state = signal<TodosState>({
        todos: [],
        loading: false,
        error: false
    })

    // Copia original de todos (sin filtro)
    private readonly copyOriginalTodos = signal<Todo[]>([])

    // Guardamos el término de filtro actual
    private readonly currentFilterTerm = signal<string>('')

    // Computed para exponer partes del estado
    readonly todos = computed(() => this.state().todos)
    readonly loading = computed(() => this.state().loading)
    readonly error = computed(() => this.state().error)

    // Acciones
    getAllTodos() {
        this.state.update(state => ({ ...state, loading: true }))

        this.todosService.getAllTodos().subscribe({
            next: todos => {
                this.copyOriginalTodos.set(todos)
                this.currentFilterTerm.set('')
                this.applyFilter('')
                this.state.update(state => ({
                    ...state,
                    loading: false,
                    error: false
                }))
            },
            error: error => {
                this.state.update(state => ({
                    ...state,
                    loading: false,
                    error: true
                }))
                console.error(error)
            }
        })
    }

    checkTodo(id: number) {
        const updated = this.copyOriginalTodos().map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
        this.updateTodos(updated)
    }

    createTodo(todo: Todo) {
        this.todosService.createTodo(todo).subscribe({
            next: created => {
                const updated = [...this.copyOriginalTodos(), created]
                this.updateTodos(updated)
            },
            error: error => {
                this.state.update(state => ({ ...state, error: true }))
                console.error(error)
            }
        })
    }

    deleteTodo(id: number) {
        this.todosService.deleteTodo(id).subscribe({
            next: () => {
                const updated = this.copyOriginalTodos().filter(todo => todo.id !== id)
                this.updateTodos(updated)
            },
            error: error => {
                this.state.update(state => ({ ...state, error: true }))
                console.error(error)
            }
        })
    }

    editTodo(todo: Todo) {
        this.todosService.editTodo(todo).subscribe({
            next: updatedTodo => {
                const updated = this.copyOriginalTodos().map(todo =>
                    todo.id === updatedTodo.id ? { ...updatedTodo } : todo
                )
                this.updateTodos(updated)
            },
            error: error => {
                this.state.update(state => ({ ...state, error: true }))
                console.error(error)
            }
        })
    }

    filterTodos(term: string) {
        this.currentFilterTerm.set(term)
        this.applyFilter(term)
    }

    // Aplica el filtro al estado usando la copia original
    private applyFilter(term: string) {
        const original = this.copyOriginalTodos()
        const filtered = term.trim()
            ? original.filter(todo => todo.title.toLowerCase().includes(term.toLowerCase()))
            : original

        this.state.update(state => ({ ...state, todos: filtered }))
    }

    // Actualiza la copia original y reaplica el filtro activo
    private updateTodos(updated: Todo[]) {
        this.copyOriginalTodos.set(updated)
        this.applyFilter(this.currentFilterTerm())
    }
}
