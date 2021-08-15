import { async } from '@angular/core/testing';
import { PageEvent } from '@angular/material';
import { AuthService } from './../../auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommentDialogComponent } from './comment-dialog/comment-dialog.component';
import { CommentService } from './comment.service';
import { PostCreateComponent } from '../post-create/post-create.component';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnDestroy, OnInit {

  posts: any[] = [];
  comments: any = []

  form: FormGroup;
  title: any;
  content: any;
  imageUrl: any;
  lottieNo: { path: string; renderer: string; autoplay: boolean; loop: boolean; };
  constructor(
    public postService: PostService,
    private commentService: CommentService,
    private authService: AuthService,
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

  currentPage = 1;
  postsPerPage = 1000;
  totalPosts = 100;
  pageSizeOptions = [1, 2, 5, 10];
  public userIsAuthenticated = false;
  ngOnInit() {
    this.userId = this.authService.getUserId();
    // this.isLoading = true;

   this.postService.getPosts().subscribe(
     (postData:any)=>{
       this.posts = postData.doc
     }
   )


    this.postsSub = this.postService.getPostUpdateListener()
      .subscribe((postData: { posts: Post[], postCount: number }) => {
        this.posts = postData.posts;
        this.isLoading = false;
        this.totalPosts = postData.postCount;
      });



    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getauthStatusListener().subscribe(
      (isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();

      }
    );
  }

  onChangedPage(pageData: PageEvent) {
    console.log(pageData);
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    // this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: String) {
    this.isLoading = true;
    this.postService.deletePost(postId)
      .subscribe(
        () => {
          // this.postService.getPosts(this.postsPerPage, this.currentPage);
        },
        () => {
          this.isLoading = false;
        }
      );
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


      console.log(comt)
      this.comments.push(comt)

    });
  }

  openCreateComponent() {
    this.dialog.open(PostCreateComponent)

  }
  // openEditDialog() {
  //   const dialogRef = this.dialog.open(PostCreateComponent,
  //     {
  //       data: {
  //         comment: this.comment
  //       }
  //     })

  //   dialogRef.afterClosed().subscribe(result => {
  //     this.comment = result
  //     this.comments.push(this.comment)
  //     console.log(result)
  //   })

  // }



}


