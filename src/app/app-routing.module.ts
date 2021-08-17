import { AuthGuard } from './auth/auth-gaurd';
import { PostListComponent } from './posts/post-list/post-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyProfileComponent } from './myProfile/my-profile.component';

const appRoutes: Routes = [
  { path: "", component: PostListComponent },
  { path: "me", component: MyProfileComponent
  , canActivate: [AuthGuard]
 },
  
//  Change from lazy loading
  { path: "auth", loadChildren: "./auth/auth-module#AuthModule" }
  ,
  { path: 'user/:username', loadChildren: () => import('./user-profile/user-profile.module').then(m => m.UserProfileModule) },
  { path: 'settings', loadChildren: () => import('./setting-page/setting-page.module').then(m => m.SettingPageModule) },
  { path: "**", redirectTo: "/", pathMatch: "full" },
];


@NgModule({

  declarations: [],
  providers: [AuthGuard],
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }