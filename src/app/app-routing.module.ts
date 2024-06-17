import { NgModule } from '@angular/core';

import { PreloadAllModules, RouterModule, type Routes } from '@angular/router';

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
    path: 'products',
    loadChildren: () =>
      import('./sets/sets.module').then((m) => m.SetsPageModule),
  },
  {
    path: 'faq',
    loadChildren: () => import('./faq/faq.module').then((m) => m.FaqPageModule),
  },
  {
    path: 'errata',
    loadChildren: () =>
      import('./errata/errata.module').then((m) => m.ErrataPageModule),
  },
  {
    path: 'changelog',
    loadChildren: () =>
      import('./changelog/changelog.module').then((m) => m.ChangelogPageModule),
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
