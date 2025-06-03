import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { API_URL } from "../../tokens/api-url.token";
import { Todo } from "../models/todo";

@Injectable({ providedIn: 'root' })
export class TodosService {
    private readonly BASE_URL = inject(API_URL)
    private readonly httpClient = inject(HttpClient)

    getAllTodos() {
        return this.httpClient.get<Todo[]>(`${this.BASE_URL}/todos`)
    }

    getDetailTodo(id: number) {
        return this.httpClient.get<Todo>(`${this.BASE_URL}/todos/${id}`)
    }

    createTodo(todo: Todo) {
        return this.httpClient.post<Todo>(`${this.BASE_URL}/todos`, todo)
    }

    editTodo(todo: Todo) {
        this.httpClient.put<Todo>(`${this.BASE_URL}/todos/${todo.id}`, todo)
    }

    deleteTodo(id: number) {
        return this.httpClient.delete(`${this.BASE_URL}/todos/${id}`)
    }
}