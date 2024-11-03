import { Injectable } from '@angular/core';
import { GroupEntity } from '../model/group.entity';
import { BaseService } from '../../shared/services/base.service';
import { HttpClient } from '@angular/common/http';
import { overrides } from 'chart.js/dist/core/core.defaults';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupMembersService extends BaseService<GroupEntity> {

  constructor(http: HttpClient) {
    super(http);
    this.resourceEndpoint = '/groups';
  }

  addGroupMember(groupId: number, memberId: number): Observable<any> {
    return this.http.post<any>(`${this.resourcePath()}/${groupId}/members`, { memberId }, this.httpOptions);
  }

  deleteGroupMember(groupId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.resourcePath()}/${groupId}/members/${userId}`, this.httpOptions);
  }

}
