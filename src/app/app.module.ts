import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HeaderModule } from './header/header.module';
import { FooterModule } from './footer/footer.module';
import { TestComponent } from './test/test.component';
import { TestModule } from './test/test.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [
    AppComponent,
    
  ],
  imports: [
    BrowserModule,
    HeaderModule,
    FooterModule,
    TestModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    // NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
