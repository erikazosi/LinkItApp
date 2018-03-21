import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AddCategoryComponent} from './add-category.component';
import {CategoryListComponent} from './category-list.component';


const categoryRoutes: Routes = [{
  path: '',
  data: {
    title: 'Category'
  },
  children: [
    {
      path: 'add',
      component: AddCategoryComponent,
      data: {
        title: 'Add'
      }
    },
    {
      path: 'list',
      component: CategoryListComponent,
      data: {
        title: 'List'
      }
    }

  ]
}];

@NgModule({
  imports: [RouterModule.forChild(categoryRoutes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule {
}
