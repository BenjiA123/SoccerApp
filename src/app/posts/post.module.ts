import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from './../angular-material.module';
import { NgModule } from '@angular/core';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommentDialogComponent } from './post-list/comment-dialog/comment-dialog.component';
import { LottieAnimationViewModule } from 'ng-lottie';
// import { NgxScrollEventModule } from 'ngx-scroll-event';

@NgModule({
    declarations: [
        PostCreateComponent,
        PostListComponent,
        CommentDialogComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        // NgxScrollEventModule,
        FormsModule,
        ReactiveFormsModule,
        AngularMaterialModule, LottieAnimationViewModule.forRoot(),
    ],

    entryComponents: [
        CommentDialogComponent,
        PostCreateComponent
    ],
})
export class PostModule { }