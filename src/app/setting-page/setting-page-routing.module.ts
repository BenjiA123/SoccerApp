import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingDetailPageComponent } from './setting-detail-page/setting-detail-page.component';

import { SettingPageComponent } from './setting-page.component';

const routes: Routes = [
  { path: '', component: SettingPageComponent , children:[
    { path: ':detail', component: SettingDetailPageComponent },
  ]},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingPageRoutingModule { }
