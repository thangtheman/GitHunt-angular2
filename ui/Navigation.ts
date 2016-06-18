import {
  Component
} from '@angular/core';

import {
  RouterLink,
  Router
} from '@angular/router-deprecated';

import {
  Profile
} from './Profile.ts';

@Component({
  selector: 'navigation',
  directives: [
    RouterLink,
    Profile
  ],
  template: `
  <nav class="navbar navbar-default">
    <div class="container">
      <div class="navbar-header">
        <a [routerLink]="['Feed', { type: 'top' }]" class="navbar-brand">GitHunt</a>
      </div>

      <ul class="nav navbar-nav">
        <li
          [class.active]="router.isRouteActive(
            router.generate(['/Feed', { type: 'hot' }])
          )">
          <a
            title="Hot"
            [routerLink]="['Feed', { type: 'hot' }]">
            Hot
          </a>
        </li>
        <li
          [class.active]="router.isRouteActive(
            router.generate(['/Feed', { type: 'top' }])
          )">
          <a
            title="Top"
            [routerLink]="['Feed', { type: 'top' }]">
            Top
          </a>
        </li>
        <li
          [class.active]="router.isRouteActive(
            router.generate(['/Feed', { type: 'new' }])
          )">
          <a
            title="New"
            [routerLink]="['Feed', { type: 'new' }]">
            New
          </a>
        </li>
      </ul>

      <profile></profile>
    </div>
  </nav>
  `
})
export class Navigation {
  constructor(public router: Router) {}
}
