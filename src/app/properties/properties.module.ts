import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertiesComponent } from './properties.component';
import { PropertiesRoutingModule } from './properties-routing.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [PropertiesComponent],
  imports: [
    CommonModule,
    PropertiesRoutingModule
  ],
  exports:[CommonModule,FormsModule]
})
export class PropertiesModule { }
