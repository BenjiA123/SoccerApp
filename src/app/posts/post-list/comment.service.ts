import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
const BACKEND_URL = environment.apiUrl + '/comments';
@Injectable({
  providedIn: 'root'
})
export class CommentService {
  comment: string
  comments: [] = []

  commentData
  private postsUpdated = new Subject<{ comment: any }>();
  constructor(private http: HttpClient) { }
  addComment(comment, postId) {

    this.commentData ={
      postId,
      comment,
    }
    console.log(this.commentData)

    this.http.post(`${BACKEND_URL}`, this.commentData)
      .subscribe(
        (resComment) => {
          console.log(resComment)


        }

      )

  }
}
