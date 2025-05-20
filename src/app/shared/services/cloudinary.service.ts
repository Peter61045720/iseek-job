import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CloudinaryService {
  private cloudName = 'dstvbaih7';
  private uploadPreset = 'iseek-job_default';
  private url = `https://api.cloudinary.com/v1_1/${this.cloudName}/upload`;
  public static DEFAULT_PROFILE_IMAGE_ID = 'default-avatar-icon';

  constructor(private httpClient: HttpClient) {}

  getImageById(id?: string): CloudinaryImage {
    const cld = new Cloudinary({
      cloud: {
        cloudName: this.cloudName,
      },
    });

    return cld.image(id).resize(fill().width(200).height(200));
  }

  uploadImage(file: File): Observable<{ public_id: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    return this.httpClient.post<{ public_id: string }>(this.url, formData);
  }
}
