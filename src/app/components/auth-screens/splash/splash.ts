import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-splash',
  imports: [],
  templateUrl: './splash.html',
  styleUrl: './splash.scss',
})
export class Splash {
   constructor(private router: Router) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigate(['auth/welcome']);
    },5000);
  }
}
