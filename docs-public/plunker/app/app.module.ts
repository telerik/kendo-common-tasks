import { NgModule }      from '@angular/core';
#= appModuleImports #

import { AppComponent }   from './app.component';

@NgModule({
  imports:      [ #= appModules # ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }
