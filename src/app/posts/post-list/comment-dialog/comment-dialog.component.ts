import { DialogData } from './comment.interface';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommentService } from '../comment.service';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-comment-dialog',
  templateUrl: './comment-dialog.component.html',
  styleUrls: ['./comment-dialog.component.css']
})
export class CommentDialogComponent implements OnInit {

  form: FormGroup

  constructor(
    public commentService:CommentService,
    public authService:AuthService,
    public dialogRef: MatDialogRef<CommentDialogComponent>,
    ) { }

    onComment() {
      if (this.form.invalid) {
        return;
      }   
      const userId = this.authService.getUserId()
      this.commentService.addComment(this.form.value.comment,userId)
      console.log(userId,this.form.value.comment)
      this.dialogRef.close();
  }

  ngOnInit() {
    this.form = new FormGroup({
      comment: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] })
    })


   }

}
