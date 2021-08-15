import { AuthService } from './../../auth/auth.service';
import { Subscription } from 'rxjs';
// import { mimeType } from './mime-type.validator';
import { Post } from './../post.model';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommentDialogComponent } from '../post-list/comment-dialog/comment-dialog.component';
import { DialogData } from '../post-list/comment-dialog/comment.interface';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  lottieSpinner: { path: string; renderer: string; autoplay: boolean; loop: boolean; };

  constructor(public dialogRef: MatDialogRef<CommentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, public postService: PostService, public route: ActivatedRoute, private authService: AuthService) {
    this.lottieSpinner = {
      path: '././assets/trail-loading.json',
      renderer: 'canvas',
      autoplay: true,
      loop: true
    };
  }
  enteredTitle = '';
  hide = true;
  private authStatusSub: Subscription;
  enteredContent = '';
  isLoading = false
  form: FormGroup
  imagePreview;

  post: Post
  public mode = "create"
  private postId: string
  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true
    // if (this.mode === 'create') {
    this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image)

    // } else {
    // this.postService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image)
    // this.form.reset()
    this.dialogRef.close()
    this.isLoading = false
    // }


  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe()

  }
  ngOnInit() {
    this.authStatusSub = this.authService.getauthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false
      }
    )
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      content: new FormControl(null, { validators: [Validators.required] })
      ,
      image: new FormControl(null, {
        validators: [Validators.required]
        // , asyncValidators: [mimeType] 
      }
      )
    })
    this.route.paramMap.subscribe(
      (paramMap: ParamMap) => {
        if (paramMap.has('postId')) {
          this.mode = 'edit'
          console.log("We are in edit mode")
          this.postId = paramMap.get('postId')
          this.isLoading = true
          this.postService.getPost(this.postId)
            .subscribe((postData) => {
              this.isLoading = false
              this.post =
                {
                  _id: postData._id,
                  title: postData.title,
                  content: postData.content,
                  imagePath: postData.imagePath,
                  creator: postData.creator
                }
              this.form.setValue({
                title: this.post.title,
                content: this.post.content,
                image: this.post.imagePath
              })
            })
        } else {
          this.mode = 'create'
          this.postId = null
        }
      }
    )
  }
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0]
    this.form.patchValue({ image: file })
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader()
    reader.onload = () => {

      this.imagePreview = reader.result
    }
    reader.readAsDataURL(file)
  }

}
