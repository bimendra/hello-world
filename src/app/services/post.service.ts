import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { catchError } from 'rxjs/operators';
import { ErrorObservable } from 'rxjs/Observable/ErrorObservable';
import { AppError } from '../common/app-error';
import { NotFoundError } from '../common/not-found-error';
import { BadRequest } from 'app/common/bad-request';

@Injectable()
export class PostService {

  private url: string = 'http://localhost:3000/posts';

  constructor(private http: Http) { }


  addPost(post) {
    return this.http.post(this.url, post)
      .pipe(
        catchError((error: Response) => {
          if(error.status === 400) {
            return ErrorObservable.create(new BadRequest(error.json()));
          } else {
            return ErrorObservable.create( new AppError(error.json()));
          }
        })
      );    
  }

  getPosts() {
    return this.http.get(this.url);
  }

  deletePost(id) {
    return this.http.delete(`${this.url}/${300}`)
      .pipe(
        catchError((error: Response) => {
          if(error.status == 404) {            
            return ErrorObservable.create(new NotFoundError(error.statusText));
          }      
          return ErrorObservable.create(new AppError(error.statusText));          
        })
      )
  }

  updatePost(id, post) {    
    return this.http.put(`${this.url}/${id}`, post);
  }

}
