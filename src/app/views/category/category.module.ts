import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryListComponent } from './category-list.component';
import {AddCategoryComponent} from './add-category.component';
import {CategoryRoutingModule} from './category-routing.module';

@NgModule({
  imports: [
    CommonModule,
    CategoryRoutingModule
  ],
  declarations: [CategoryListComponent,AddCategoryComponent]
})
export class CategoryModule { }
