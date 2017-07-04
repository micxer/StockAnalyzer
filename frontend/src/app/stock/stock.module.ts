import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DataTableModule, SharedModule, DialogModule, ButtonModule, TabViewModule, AccordionModule } from 'primeng/primeng';

import { ChartModule } from 'angular-highcharts';

import { StockService } from './stock.service';
import { FundamentalService } from './fundamental.service';
import { TechnicalDataService } from './technicaldata.service';
import { IndexService } from './index.service';

import { stockRoutes } from './stock.routes';

import { StockComponent } from './stock/stock.component';
import { FundamentalComponent } from './fundamental/fundamental.component';
import { LevermannComponent } from './levermann/levermann.component';
import { IndexComponent } from './index/index.component';
import { IndexdetailComponent } from './indexdetail/indexdetail.component';

@NgModule({
  imports: [
    RouterModule.forRoot(stockRoutes),
    CommonModule,
    HttpModule,
    FormsModule,
    BrowserAnimationsModule,
    DataTableModule,
    DialogModule,
    ButtonModule,
    TabViewModule,
    AccordionModule,
    SharedModule,
    ChartModule
  ],
  exports: [
    StockComponent
  ],
  providers: [
    StockService,
    FundamentalService,
    TechnicalDataService,
    IndexService
  ],
  declarations: [StockComponent, FundamentalComponent, LevermannComponent, IndexComponent, IndexdetailComponent]
})
export class StockModule { }
