import { NgModule }      from '@angular/core';
#= appModuleImports #

import 'hammerjs';

import { AppComponent }   from './app.component';

@NgModule({
  imports:      [ #= appModules # ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }
