import { NgModule } from '@angular/core';

import { PreloadAllModules, RouterModule, type Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
    data: {
      title: 'Leder Card Library',
    },
  },
  {
    path: 'advanced',
    loadChildren: () =>
      import('./advanced/advanced.module').then((m) => m.AdvancedPageModule),
    data: {
      title: 'Leder Card Library - Advanced Search',
    },
  },
  {
    path: 'search',
    loadChildren: () =>
      import('./search/search.module').then((m) => m.SearchPageModule),
    data: {
      title: 'Leder Card Library - Card Search',
    },
  },
  {
    path: 'card/:id',
    loadChildren: () =>
      import('./card/card.module').then((m) => m.CardPageModule),
    data: {
      title: '',
    },
  },
  {
    path: 'syntax',
    loadChildren: () =>
      import('./syntax/syntax.module').then((m) => m.SyntaxPageModule),
    data: {
      title: 'Leder Card Library - Search Help',
    },
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./sets/sets.module').then((m) => m.SetsPageModule),
    data: {
      title: 'Leder Card Library - Product List',
    },
  },
  {
    path: 'faq',
    loadChildren: () => import('./faq/faq.module').then((m) => m.FaqPageModule),
    data: {
      title: 'Leder Card Library - FAQs',
    },
  },
  {
    path: 'errata',
    loadChildren: () =>
      import('./errata/errata.module').then((m) => m.ErrataPageModule),
    data: {
      title: 'Leder Card Library - Errata',
    },
  },
  {
    path: 'changelog',
    loadChildren: () =>
      import('./changelog/changelog.module').then((m) => m.ChangelogPageModule),
    data: {
      title: 'Leder Card Library - Changelogs',
    },
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
