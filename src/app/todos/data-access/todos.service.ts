import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { API_URL } from "../../tokens/api-url.token";

@Injectable({providedIn: 'root'})
export class TodosService {
    private readonly BASE_URL = inject(API_URL)
    private readonly httpClient = inject(HttpClient)

    getAllTodos(){
        return this.httpClient.get(`${this.BASE_URL}/todos`)
    }
}