import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
const BACKEND_URL = environment.apiUrl + '/posts';
@Injectable({
  providedIn: 'root'
})
export class CommentService {
  comment: string
  comments: [] = []

  private postsUpdated = new Subject<{ comment: any }>();
  constructor(private http: HttpClient) { }
  addComment(comment, postId) {
    console.log(comment)

    this.http.patch<{ message: string }>(`${BACKEND_URL}/${comment}/${postId}`, null)
      .subscribe(
        (resComment) => {
          this.comment = resComment.message


        }

      )

  }
}
