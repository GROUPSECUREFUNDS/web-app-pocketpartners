import { GroupEntity } from '../model/group.entity';
import { BaseService } from '../../shared/services/base.service';
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GroupService extends BaseService<GroupEntity> {

  constructor(http: HttpClient) {
    super(http);
    this.resourceEndpoint = '/groups';
  }

  putANewGroup(groupName: string, groupPhoto: string, currency: any) {
    return this.http.post<GroupEntity>(`${this.resourcePath()}`, { name: groupName, groupPhoto: groupPhoto, currency: [currency] }, this.httpOptions);
  }

  getById(id: number) {
    return this.http.get<GroupEntity>(`${this.resourcePath()}/${id}`, this.httpOptions);
  }

  getExpensesById(id: number) {
    return this.http.get<GroupEntity>(`${this.resourcePath()}/groupOperations/groupId/${id}`, this.httpOptions);
  }

  getAllMembersByIdGroup(id: number) {
    return this.http.get<GroupEntity>(`${this.resourcePath()}/${id}/members`, this.httpOptions);
  }

  joinGroup(groupId: number, userId: number) {
    return this.http.post<GroupEntity>(`${this.resourcePath()}/${groupId}/members/${userId}`, null, this.httpOptions);
  }

  getAllGroups(): Observable<GroupEntity[]> {
    return this.http.get<GroupEntity[]>(this.resourceEndpoint, this.httpOptions);
  }

  joinGroupWithToken(groupId: number, userId: number, token: string) {
    return this.http.post<GroupEntity>(`${this.resourcePath()}/${groupId}/members/${userId}`, { token }, this.httpOptions);
  }

}
