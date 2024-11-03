import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {BaseService} from "../../shared/services/base.service";
import {GroupEntity} from "../model/group.entity";
import {OperationEntity} from "../model/operation-entity";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GroupOperationsService extends BaseService<OperationEntity> {
  constructor(http: HttpClient) {
    super(http);
    this.resourceEndpoint = '/groupOperations';
  }

  getAllGroupOperationsByGroupId(id: number): Observable<OperationEntity[]> {
    return this.http.get<OperationEntity[]>(`${this.resourcePath()}/groupId/${id}`, this.httpOptions);
  }

  postOperation(operation: OperationEntity): Observable<OperationEntity> {
    return this.http.post<OperationEntity>(`${this.resourcePath()}`, operation, this.httpOptions);
  }
}
