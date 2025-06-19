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

  getById(id: number) {

    return this.http.get<GroupEntity>(`${this.resourcePath()}/${id}`, this.httpOptions);
  }


   updateGroup(id: number, name: string,description: string): Observable<GroupEntity> {
    return this.http.put<GroupEntity>(`${this.resourcePath()}/${id}`, { name, description }, this.httpOptions);
  }



  updateGroupImage(id: number , image: string): Observable<GroupEntity> {
    return this.http.put<GroupEntity>(`${this.resourcePath()}/${id}/image`, { image }, this.httpOptions);
  }



  deleteGroup(id: number): Observable<{}> {
    return this.http.delete(`${this.resourcePath()}/${id}`, this.httpOptions);
  }




  getAllGroups(): Observable<GroupEntity[]> {
    return this.http.get<GroupEntity[]>(this.resourceEndpoint, this.httpOptions);
  }


  getAllGroupsByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.resourcePath()}/user/${userId}`, this.httpOptions);
  }

  createGroup(groupName: string, groupPhoto: string, description: string, adminId: number) {
    const body = {
      name: groupName,
      groupPhoto: groupPhoto,
      description: description,
      adminId: adminId
    };
    return this.http.post<GroupEntity>(`${this.resourcePath()}`, body, this.httpOptions);
  }



  getAllMembersByIdGroup(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.resourcePath()}/${id}/members`, this.httpOptions);
  }

  generateInvitation(groupId: number): Observable<string> {
    return this.http.post(`${this.resourcePath()}/${groupId}/generate-invitation`, {}, { ...this.httpOptions, responseType: 'text' as 'json' }) as Observable<string>;
  }

  joinGroup(groupId: number, userId: number, token: string): Observable<any> {
    return this.http.post<any>(`${this.resourcePath()}/${groupId}/join`, { userId, token }, this.httpOptions);
  }

}
