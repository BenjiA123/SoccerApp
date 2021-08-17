import { DialogData } from './comment.interface';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommentService } from '../comment.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-comment-dialog',
  templateUrl: './comment-dialog.component.html',
  styleUrls: ['./comment-dialog.component.css']
})
export class CommentDialogComponent implements OnInit {

  form: FormGroup

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {postId: string},
    public commentService:CommentService,
    public authService:AuthService,
    public dialogRef: MatDialogRef<CommentDialogComponent>,
    ) { }

    onComment() {
      if (this.form.invalid) {
        return;
      }   

      // PostId not userId you recive the postId through the dialog
      this.commentService.addComment(this.form.value.comment,this.data.postId)
      console.log(this.data.postId,this.form.value.comment)
      this.dialogRef.close();
  }

  ngOnInit() {
    this.form = new FormGroup({
      comment: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] })
    })


   }

}
