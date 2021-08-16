import { AuthService } from './../../auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup} from '@angular/forms';
import { CommentDialogComponent } from './comment-dialog/comment-dialog.component';
import { CommentService } from './comment.service';
import { PostCreateComponent } from '../post-create/post-create.component';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnDestroy, OnInit {

  public posts: Post[] = [];
  comments: any = []

  form: FormGroup;
  title: any;
  content: any;
  imageUrl: any;
  lottieNo: { path: string; renderer: string; autoplay: boolean; loop: boolean; };
  constructor(
    public authService: AuthService,
    public postService: PostService,
    private commentService: CommentService,
    public dialog: MatDialog) {
    this.lottieNo = {
      path: '././assets/chair-dude.json',
      renderer: 'canvas',
      autoplay: true,
      loop: true
    };
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

  public userIsAuthenticated = false;
  ngOnInit() {
    this.userId = this.authService.getUserId();

   this.postService.getPosts()
  //  Listening to changes in posts for subject
    this.postsSub = this.postService.getPostUpdateListener()
      .subscribe((posts:Post[])=>{
        this.posts = posts
      });


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
  hide = true
  lottieSpinner

  openCommentDialog(id: string): void {
    const dialogRef = this.dialog.open(CommentDialogComponent,
      {
        width: '360px',
        height: '200px',
        data: {
          id: id,
          comment: this.comment
        }
      })
    dialogRef.afterClosed().subscribe(result => {
      this.comment = result
      let comt = this.commentService.addComment(this.comment, id)
      this.comments.push(comt)

    });
  }

  openCreateComponent() {
    this.dialog.open(PostCreateComponent)

  }
}


