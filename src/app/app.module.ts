import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HeaderModule } from './header/header.module';
import { FooterModule } from './footer/footer.module';
import { TestModule } from './test/test.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PropertiesModule } from './properties/properties.module';
import { PreviewModule } from './preview/preview.module';
import { CoreModule } from './shared/core.module';
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    CoreModule,
    PreviewModule,
    PropertiesModule,
    HeaderModule,
    FooterModule,
    TestModule,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
