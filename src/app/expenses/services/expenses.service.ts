import { Injectable } from '@angular/core';
import { ExpensesEntity } from '../model/expenses.entity';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {BaseService} from "../../shared/services/base.service";

@Injectable({
  providedIn: 'root'
})
export class ExpensesService extends BaseService<ExpensesEntity> {

  constructor(http: HttpClient) {
    super(http);
    this.resourceEndpoint = '/expenses';
  }


  getJoinedUserGroups(userId: number): Observable<any> {
    return this.http.get<any>(`${this.basePath}/groups/members/${userId}`, this.httpOptions);
  }

  getExpenseById(expenseId: any) {
    return this.http.get<any>(`${this.resourcePath()}/${expenseId}`, this.httpOptions)
  }

  getExpensesByGroupId(groupId: number): Observable<ExpensesEntity[]> {
    return this.http.get<ExpensesEntity[]>(`${this.resourcePath()}/groupId/${groupId}`, this.httpOptions);
  }

  getExpenses(): Observable<ExpensesEntity[]> {
    return this.http.get<ExpensesEntity[]>(this.resourcePath(), this.httpOptions);
  }

  getExpensesByUserId(userId: number): Observable<ExpensesEntity[]> {
    return this.http.get<ExpensesEntity[]>(`${this.resourcePath()}/userId/${userId}`, this.httpOptions);
  }

  deleteExpenseById(expenseId: number): Observable<any> {
    return this.http.delete<any>(`${this.resourcePath()}/expenseId/${expenseId}`, this.httpOptions);
  }

  createExpense(expense: ExpensesEntity) {
    return this.http.post<any>(`${this.resourcePath()}`, expense, this.httpOptions)
  }


}


