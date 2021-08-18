import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingPageRoutingModule } from './setting-page-routing.module';
import { SettingPageComponent } from './setting-page.component';
import { AngularMaterialModule } from '../angular-material.module';
import { SettingDetailPageComponent } from './setting-detail-page/setting-detail-page.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [SettingPageComponent, SettingDetailPageComponent],
  imports: [
    CommonModule,
    SettingPageRoutingModule,
    FormsModule,
    AngularMaterialModule
  ]
})
export class SettingPageModule { }
