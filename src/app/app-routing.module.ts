import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'quiz',
    loadChildren: () => import('./pages/quiz/quiz.module').then( m => m.QuizPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'leveled',
    loadChildren: () => import('./pages/leveled/leveled.module').then( m => m.LeveledPageModule)
  },
  {
    path: 'theme',
    loadChildren: () => import('./pages/theme/theme.module').then( m => m.ThemePageModule)
  },
  {
    path: 'subjects',
    loadChildren: () => import('./pages/subjects/subjects.module').then( m => m.SubjectsPageModule)
  },
  {
    path: 'stats',
    loadChildren: () => import('./pages/stats/stats.module').then( m => m.StatsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'reset',
    loadChildren: () => import('./pages/reset/reset.module').then( m => m.ResetPageModule)
  },
  {
    path: 'forgot',
    loadChildren: () => import('./pages/forgot/forgot.module').then( m => m.ForgotPageModule)
  },
  {
    path: 'test',
    loadChildren: () => import('./pages/test/test.module').then( m => m.TestPageModule)
  },
  {
    path: 'genre',
    loadChildren: () => import('./pages/genre/genre.module').then( m => m.GenrePageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'books',
    loadChildren: () => import('./pages/books/books.module').then( m => m.BooksPageModule)
  },
  {
    path: 'repeat',
    loadChildren: () => import('./pages/repeat/repeat.module').then( m => m.RepeatPageModule)
  },
  {
    path: 'signin',
    loadChildren: () => import('./pages/signin/signin.module').then( m => m.SigninPageModule)
  },
  {
    path: 'classeroom',
    loadChildren: () => import('./pages/classeroom/classeroom.module').then( m => m.ClasseroomPageModule)
  },
  {
    path: 'newstudent',
    loadChildren: () => import('./pages/newstudent/newstudent.module').then( m => m.NewstudentPageModule)
  },
  {
    path: 'editstudent',
    loadChildren: () => import('./pages/editstudent/editstudent.module').then( m => m.EditstudentPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
