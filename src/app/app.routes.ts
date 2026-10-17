import { Routes } from '@angular/router';
import { SignUp } from './components/sign-up/sign-up';
import { NotFoundError } from '@angular/core/primitives/di';
import { NotFound } from './components/not-found/not-found';

export const routes: Routes = [
  { path: '', component: SignUp },
  { path: 'signUp', component: SignUp },
  { path: '**', component: NotFound },
];
