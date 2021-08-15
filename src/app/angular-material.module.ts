import { NgModule } from '@angular/core';
import {
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSliderModule,
    MatIconModule
}
    from '@angular/material'

@NgModule({

    exports: [

        MatDialogModule,
        MatSliderModule,
        MatDialogModule,
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatToolbarModule,
        MatPaginatorModule,
        MatExpansionModule,
        MatProgressSpinnerModule,
        MatIconModule
    ]
})
export class AngularMaterialModule {

}