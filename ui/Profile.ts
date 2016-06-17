import {
  Component
} from '@angular/core';

import {
  RouterLink
} from '@angular/router-deprecated';

import {
  Apollo
} from 'angular2-apollo';

import gql from 'apollo-client/gql';

import {
  client
} from './client.ts';

export interface Profile {
  data: any;
}

@Component({
  selector: 'profile',
  directives: [
    RouterLink
  ],
  template: `
    <p *ngIf="data.loading" class="navbar-text navbar-right">
      Loading...
    </p>
    <span *ngIf="!data.loading && data.currentUser">
      <p class="navbar-text navbar-right">
        {{ data.currentUser.login }}
        &nbsp;
        <a href="/logout">Log out</a>
      </p>
      <a
        class="btn navbar-btn navbar-right btn-success"
        [routerLink]="['Submit']">
        <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
          &nbsp;
          Submit
      </a>
    </span>
    <p *ngIf="!data.loading && !data.currentUser" class="navbar-text navbar-right">
      <a href="/login/github">Log in with GitHub</a>
    </p>
  `
})
@Apollo({
  client,
  queries(context) {
    return {
      data: {
        query: gql`
          query CurrentUserForProfile {
            currentUser {
              login
              avatar_url
            }
          }
        `
      }
    };
  }
})
export class Profile {}
