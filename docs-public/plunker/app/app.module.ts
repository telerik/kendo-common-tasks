import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
#= appModuleImports #

import { AppComponent }   from './app.component';

@NgModule({
  imports:      [ BrowserModule, #= appModules # ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }
