import { NgModule } from '@angular/core';

import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'advanced',
    loadChildren: () =>
      import('./advanced/advanced.module').then((m) => m.AdvancedPageModule),
  },
  {
    path: 'search',
    loadChildren: () =>
      import('./search/search.module').then((m) => m.SearchPageModule),
  },
  {
    path: 'card/:id',
    loadChildren: () =>
      import('./card/card.module').then((m) => m.CardPageModule),
  },
  {
    path: 'syntax',
    loadChildren: () =>
      import('./syntax/syntax.module').then((m) => m.SyntaxPageModule),
  },
  {
    path: 'sets',
    loadChildren: () =>
      import('./sets/sets.module').then((m) => m.SetsPageModule),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
