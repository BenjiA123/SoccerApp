import { AuthService } from './../../auth/auth.service';
import { Component,HostListener, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup} from '@angular/forms';
import { CommentDialogComponent } from './comment-dialog/comment-dialog.component';
import { CommentService } from './comment.service';
import { PostCreateComponent } from '../post-create/post-create.component';
import { Event } from '@angular/router';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnDestroy, OnInit {

  currentPage:number =1
  limit:number = 3
  totalPosts:number


  hasMorePosts(limit,page,total){
    const startIndex = (page - 1) * limit + 1;
    return total === 0 || startIndex < total;
  }


  @HostListener('document:scroll',['$event']) scrollEvent(eventData:Event){
    let pos = (document.documentElement.scrollTop) + document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight;
    // pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.

     if(pos == max )   {

     this.currentPage = this.currentPage+1
   
     if(this.hasMorePosts(this.limit,this.currentPage,this.totalPosts)){

      
    this.postService.getPosts(this.limit,'created_at',this.currentPage)

  //  Listening to changes in posts for subject
    this.postsSub = this.postService.getPostUpdateListener()
      .subscribe((postData:{posts:Post[],totalPosts:number})=>{
          
          this.posts =  this.posts.concat(postData.posts)     


      });

    }else{ this.currentPage = this.currentPage -1}

     }
  }

  



  lottieSpinner: { path: string; renderer: string; autoplay: boolean; loop: boolean; };

  public posts: Post[] = [];
  public comments: any[] = []

  form: FormGroup;
  title: any;
  content: any;
  imageUrl: any;
  constructor(
    public authService: AuthService,
    public postService: PostService,
    private commentService: CommentService,
    public dialog: MatDialog) {

    this.lottieSpinner = {
      path: '././assets/trail-loading.json',
      renderer: 'canvas',
      autoplay: true,
      loop: true
    };
  }
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  userId: string;
  isLoading = false;
  recentUsers

    public userIsAuthenticated = false;
  ngOnInit() {

// DONALD TOLD ME TO REMOVE THIS
    // this.postService.getRecentUsers().subscribe(
    //   (users:any)=>{
    //     this.recentUsers = users.doc
    //   }
    // )


    this.userId = this.authService.getUserId();




    // Loads only 10 posts
   this.postService.getPosts(3,'created_at',1)
  //  Listening to changes in posts for subject
    this.postsSub = this.postService.getPostUpdateListener()
      .subscribe((postData:{posts:Post[],totalPosts:number})=>{
        this.totalPosts = postData.totalPosts
        this.posts = postData.posts
      });

  //  Listening to changes in comments for subject
      this.commentService.getCommentListener()
      .subscribe(
        (data:any[])=>{
          this.comments = data
        }
      )

      this.userIsAuthenticated = this.authService.getIsAuth()
      // This isnt bening triggered but when triggered fetches the current auth Status
      this.authStatusSub = this.authService.getauthStatusListener()    
      .subscribe(
        (isAuthenticated:boolean)=>{
          this.userIsAuthenticated = isAuthenticated
          this.userId = this.authService.getUserId();  
        }
      )
  }



  onDelete(postId: string) {
    this.postService.deletePost(postId)
     
  }
  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
  comment: string;
  openCommentDialog(postId) {
    // Send post Id from here to dialog
    this.dialog.open(CommentDialogComponent, {
      data: { postId: postId},
    });

  }
  getCommentsOnOnePost(postId){
    this.commentService.getCommentsOnOnePost(postId)

  }


  openCreateComponent() {
    this.dialog.open(PostCreateComponent)

  }
  bottomPage(event){
    console.log(event)
  }
  

}


