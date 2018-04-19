import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { GridDemoBaseComponent } from './grid-demo.base.component';
import { GridDemoComponent } from './grid-demo.component';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@progress/kendo-angular-layout';

import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { KbGridComponent } from './shared/components/grid/grid.component';

import { TopSectionComponent } from './topSection';

import { CoreModule } from './core/core.module';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
      path: '**',
      component: GridDemoComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    KbGridComponent,
    GridDemoBaseComponent,
    GridDemoComponent,
    TopSectionComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    CommonModule,
    GridModule,
    LayoutModule,
    DropDownsModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    GridModule,
    KbGridComponent,
    RouterModule
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
