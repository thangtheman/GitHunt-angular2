import 'es6-shim';
import 'reflect-metadata';
import 'zone.js/dist/zone';

import {
  Component
} from '@angular/core';

import {
  bootstrap
} from '@angular/platform-browser-dynamic';

import {
  RouteConfig,
  RouterOutlet,
  ROUTER_PROVIDERS
} from '@angular/router-deprecated';

import {
  Feed
} from './Feed.ts';

import {
  Navigation
} from './Navigation.ts';

import {
  NewEntry
} from './NewEntry.ts';

import './style.css';

@Component({
  selector: 'git-hunt',
  directives: [
    Navigation,
    RouterOutlet
  ],
  template: `
    <div>
      <navigation></navigation>
      <div class="container">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
@RouteConfig([
  { path: '/',            redirectTo: ['Feed', { type: 'top' }]},
  { path: '/feed/:type',  name: 'Feed',     component: Feed },
  { path: '/submit',      name: 'Submit',   component: NewEntry }
])
class GitHunt {}

bootstrap(GitHunt, [
  ROUTER_PROVIDERS
]);
