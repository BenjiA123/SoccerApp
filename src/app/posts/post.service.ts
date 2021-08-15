import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "./../../environments/environment";
const BACKEND_URL = environment.apiUrl + "/posts";
@Injectable({
  providedIn: "root",
})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();
  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {

   return this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL
      )
  }
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("imagePath", image, title);
    this.http
      .post<{ message: string; data: Post }>(BACKEND_URL, postData)
      .subscribe((responseData) => {
        console.log(responseData.data._id)
        const post: Post = {
          _id: responseData.data._id,
          title: title,
          content: content,
          creator: null,
          imagePath: responseData.data.imagePath,
        };

        this.posts.push(post);
        this.postsUpdated.next({ posts: [...this.posts], postCount: null });
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: String) {
    return this.http.delete(`${BACKEND_URL}/${postId}`);
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>(`${BACKEND_URL}/${id}`);
  }
  updatePost(
    _id: string,
    title: string,
    content: string,
    image: File | string
  ) {
    let postData: Post | FormData;
    if (typeof image == "object") {
      postData = new FormData();
      postData.append("_id", _id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        _id: _id,
        title: title,
        content: content,
        imagePath: image,
        creator: null,
      };
    }
    return this.http
      .put(`${BACKEND_URL}/${_id}`, postData)
      .subscribe((response) => {
        // console.log(response)
        // const updatedPosts = [...this.posts]
        // const oldPostIndex = updatedPosts.findIndex(p => {
        //   p._id === _id
        //   const post :Post = {
        //     _id:_id,
        //     title:title,
        //     content:content,
        //     imagePath:""

        //   }
        //   updatedPosts[oldPostIndex] = post
        //   this.posts = updatedPosts
        //   this.postsUpdated.next([...this.posts])
        this.router.navigate(["/"]);
        // }

        // )
      });
  }
}
