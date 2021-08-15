import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  message = "Check your Connection and Try Again👌😎"
  lottie;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {
    this.lottie = {
      path: '././assets/cloud-error.json',
      renderer: 'canvas',
      autoplay: true,
      loop: true
    };
  }

  ngOnInit() {
  }

}
