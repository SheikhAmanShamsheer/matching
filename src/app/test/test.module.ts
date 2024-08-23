import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestComponent } from './test.component';
import { TestRoutingModule } from './test-routing.module';
import { FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [TestComponent],
  imports: [
    CommonModule,TestRoutingModule,FormsModule,MatIconModule
  ]
})
export class TestModule { }
