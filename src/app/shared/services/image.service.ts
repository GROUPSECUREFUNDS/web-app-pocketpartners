import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BaseService} from "./base.service";

@Injectable({
  providedIn: 'root'
})
export class ImageService extends BaseService<any>{

    constructor( httpClient:HttpClient) {
      super(httpClient);
      this.resourceEndpoint = '/images';
    }

    getImageUrlById(imageId: string): string {
        return `${this.resourcePath()}/${imageId}`;
    }

    postImage(image:File){
        const formData = new FormData();
        formData.append('file', image, image.name);
        return this.http.post<any>(this.resourcePath(), formData)
    }
}
