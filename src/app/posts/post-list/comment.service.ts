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
  comments: any[] = []

  commentData
  private commentsUpdated = new Subject();
  constructor(private http: HttpClient) { }
  addComment(comment:string, postId:string) {
    this.commentData ={
      postId,
      comment,
    }
    this.http.post(`${BACKEND_URL}`, this.commentData)
      .subscribe(
        (resComment:any) => {
          console.log(resComment.message)
          this.comments.push(resComment.message)
          this.commentsUpdated.next([...this.comments])
        }

      )

  }

  getCommentsOnOnePost(postId:string){
    this.http.get(`${BACKEND_URL}/post/${postId}`)
    .subscribe(
      (commentData:any)=>{

        this.comments = commentData.doc
        console.log(this.comments)
        this.commentsUpdated.next([...this.comments])
      }
    )


  }

  getCommentListener() {
    return this.commentsUpdated.asObservable();
  }



}
