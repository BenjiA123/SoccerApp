import { AuthGuard } from './auth/auth-gaurd';
import { PostListComponent } from './posts/post-list/post-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { MyProfileComponent } from './myProfile/my-profile.component';

const appRoutes: Routes = [
  { path: "", component: PostListComponent },
  { path: "create", component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: "edit/:postId", component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: "me", component: MyProfileComponent
  , canActivate: [AuthGuard]
 },
  
  { path: "auth", loadChildren: "./auth/auth-module#AuthModule" }
  ,
  { path: "**", redirectTo: "/", pathMatch: "full" }
];


@NgModule({

  declarations: [],
  providers: [AuthGuard],
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }