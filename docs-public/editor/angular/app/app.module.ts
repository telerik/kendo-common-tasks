import { NgModule }      from '@angular/core';
#= appImports #

import 'hammerjs';

import { AppComponent }   from './app.component';

@NgModule({
  imports:      [ #= appModuleImports # ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }
