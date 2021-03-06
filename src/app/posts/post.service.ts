import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "./../../environments/environment";
const BACKEND_URL = environment.apiUrl + "/posts";
const BACKEND_USER_URL = environment.apiUrl + "/users";
@Injectable({
  providedIn: "root",
})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts:Post[],totalPosts:number}>();
  constructor(private http: HttpClient, private router: Router) {}

  postCount
  getPosts(limit:number,sort:string,page:number) {

    // Set this.posts to something
   this.http.get(`${BACKEND_URL}?limit=${limit}&sort=${sort}&page=${page}`)
   .subscribe(
    (postData:any)=>{
      this.posts = postData.doc
      this.postCount = postData.totalCount
      this.postsUpdated.next({posts:[...this.posts],totalPosts:postData.totalCount})
    }
  )
}

  // Functions are used with subjects to create an object that we can respond to
  // You can emmit from this file but not from other files
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {

    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    // You are sending an Image file ,not an imagePath
    if(image !=null)  postData.append("imagePath", image, title);
    this.http
      .post<{ status: string; data: Post;totalPosts:number }>(BACKEND_URL, postData)
      .subscribe((responseData:any) => {
        const post: Post = {
          _id: responseData.data._id,
          title: title,
          content: content,
          creator: responseData.data.creator,
          imagePath: responseData.data.imagePath,
        };
        
        this.posts.push(post);
        this.postsUpdated.next({posts:[...this.posts],totalPosts:responseData.totalCount});

      });
  }

  
  deletePost(postId: string) {
    this.http.delete(`${BACKEND_URL}/${postId}`)
    .subscribe( (deleteData:any) =>{ 
        const updatedPosts = this.posts.filter(post => post._id !== postId)
        this.posts = updatedPosts
        this.postsUpdated.next({posts:[...this.posts],totalPosts:deleteData.totalCount});
})

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

  getRecentUsers(){

    // /users?fields=name,username,imagePath,created_at&sort=-created_at&limit=3

    return this.http
    .get(`${BACKEND_USER_URL}/?fields=name,username,imagePath,created_at&sort=-created_at&limit=10`)
  }
}
