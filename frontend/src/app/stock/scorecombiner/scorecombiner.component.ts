import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';

import { SelectItem, Message } from 'primeng/primeng';

import { StockService } from '../stock.service';
import { IndexService } from '../index.service';

import { Score } from '../score';
import { Stock } from '../stock';
import { IndexType } from '../indextype';
import { Country } from '../country';
import { Branch } from '../branch';

import { CountryTranslationPipe } from '../country_translation.pipe';
import { BranchTranslationPipe } from '../branch_translation.pipe';
import { CommonTranslationPipe } from '../common_translation.pipe';
import { MessageTranslationPipe } from '../message_translation.pipe';

@Component({
  selector: 'app-scorecombiner',
  templateUrl: './scorecombiner.component.html',
  styleUrls: ['./scorecombiner.component.css']
})
export class ScorecombinerComponent implements OnInit {
  levermannFactor: number = 40;
  magicFormulaFactor: number = 20;
  piotroskiFactor: number = 40;
  numRowValues: SelectItem[] = [];
  numRows: number = 10;
  msgs: Message[] = [];
  scores: Score[];
  countries: SelectItem[];
  excludedCountries: number[];
  branches: SelectItem[];
  excludedBranches: number[];
  selectedScore: Score;
  stockOrIndexItem: SelectItem[] = [];
  companySizeItems: SelectItem[] = [];
  stockOrIndex: string = 'stock';
  companySize: number = 0;
  loading: boolean = false;
  commonTranslationPipe: CommonTranslationPipe = new CommonTranslationPipe('en-US');
  countryTranslationPipe: CountryTranslationPipe = new CountryTranslationPipe('en-US');
  branchTranslationPipe: BranchTranslationPipe = new BranchTranslationPipe('en-US');
  messagePipe: MessageTranslationPipe = new MessageTranslationPipe('en-US');
  constructor(private stockService: StockService, private indexService: IndexService, @Inject(LOCALE_ID) private locale: string) {
    this.numRowValues.push({label: '10', value: 10});
    this.numRowValues.push({label: '20', value: 20});
    this.numRowValues.push({label: '30', value: 30});

    this.stockOrIndexItem.push({label: this.commonTranslationPipe.transform('Stocks', this.locale), value: 'stock'});
    this.stockOrIndexItem.push({label: this.commonTranslationPipe.transform('Indices', this.locale), value: 'index'});
    
    this.companySizeItems.push({label: 'Large, Mid and Small Caps', value: 0});
    this.companySizeItems.push({label: 'Large and Mid Caps', value: 1});
    this.companySizeItems.push({label: 'Large Caps', value: 2});
    this.companySizeItems.push({label: 'Mid Caps', value: 3});
    this.companySizeItems.push({label: 'Small Caps', value: 4});
    
      this.stockService.getAllCountries()
          .subscribe((data:any) => {
              this.countries = [];
                if (data && Object.keys(data).indexOf("_embedded") > -1 && Object.keys(data._embedded).indexOf("countries") > -1)
                    for (let country of data._embedded.countries) {
                      this.countries.push({label: this.countryTranslationPipe.transform(country.name, this.locale), value: country.countryId});
                    }
            });

      this.stockService.getAllBranches()
          .subscribe((data:any) => {
              this.branches = [];
                if (data && Object.keys(data).indexOf("_embedded") > -1 && Object.keys(data._embedded).indexOf("branches") > -1)
                    for (let branch of data._embedded.branches) {
                      this.branches.push({label: this.branchTranslationPipe.transform(branch.name, this.locale), value: branch.branchId});
                    }
            });
  }

  ngOnInit() {
  }
  
  showStock(score: Score) {
    this.selectedScore = score;
    this.stockService.getStockEmitter().emit(this.selectedScore.stock);
  }
  
  showIndex(score: Score) {
    this.selectedScore = score;
    this.indexService.getIndexEmitter().emit(this.selectedScore.index);
  }
  
  getScoreValues() {
    let fromMarketCap: number = null;
    let toMarketCap: number = null;
    switch (this.companySize) {
      // 'Large and Mid Caps'
      case 1:
        fromMarketCap = 2000;
        break;
      // 'Large Caps'
      case 2:
        fromMarketCap = 10000;
        break;
      // 'Mid Caps'
      case 3:
        fromMarketCap = 2000;
        toMarketCap = 10000;
        break;
      // 'Small Caps'
      case 4:
        toMarketCap = 2000;
    }
    this.loading = true;
    if (this.stockOrIndex == 'stock') {
      this.stockService.getNormalizedScores(this.levermannFactor / 100, this.magicFormulaFactor / 100, this.piotroskiFactor / 100, this.excludedCountries, this.excludedBranches, fromMarketCap, toMarketCap, this.numRows)
        .subscribe((data: any) => {
        this.scores = data["_embedded"]["normalizedscore"];
        for (let score of this.scores) {
          this.stockService.getStockFromNormalizedValue(score.scoreId)
            .subscribe((data:Stock) => {
              score.stock = data;
              this.loading = false;
            }, (err:any) => this.loading = false);
        }
      }, (err:any) => this.loading = false);
    } else {
      this.indexService.getNormalizedScores(this.levermannFactor / 100, this.magicFormulaFactor / 100, this.piotroskiFactor / 100, this.excludedCountries, this.numRows)
        .subscribe((data: any) => {
        this.scores = data["_embedded"]["normalizedscore"];
        for (let score of this.scores) {
          this.indexService.getIndexFromNormalizedValue(score.scoreId)
            .subscribe((data:IndexType) => {
              score.index = data;
              this.loading = false;
            }, (err:any) => this.loading = false);
        }
      }, (err:any) => this.loading = false);
    }
  }
  
  handleChange(event: any) {
    let sumFactors = this.levermannFactor + this.magicFormulaFactor + this.piotroskiFactor;
    if (sumFactors != 100)
      this.msgs = [{severity: 'info', summary: '', detail: this.messagePipe.transform(18, this.locale) + sumFactors + ")"}];
    else
      this.msgs = [];
  }
  
  handleSelectChange(event: any) {
    this.scores = [];
  }
  
  isValid(): boolean {
    return (this.levermannFactor + this.magicFormulaFactor + this.piotroskiFactor) == 100;
  }
  
  setPureLevermann() {
    this.levermannFactor = 100;
    this.magicFormulaFactor = 0;
    this.piotroskiFactor = 0;
    this.handleChange(null);
  }
  
  setPurePiotroski() {
    this.levermannFactor = 0;
    this.magicFormulaFactor = 0;
    this.piotroskiFactor = 100;
    this.handleChange(null);
  }
  
  setPureMagicFormula() {
    this.levermannFactor = 0;
    this.magicFormulaFactor = 100;
    this.piotroskiFactor = 0;
    this.handleChange(null);
  }
  
  isPureLevermann() {
    return this.levermannFactor == 100 && this.piotroskiFactor == 0 && this.magicFormulaFactor == 0;
  }

  isPurePiotroski() {
    return this.levermannFactor == 0 && this.piotroskiFactor == 100 && this.magicFormulaFactor == 0;
  }
  
  isPureMagicFormula() {
    return this.levermannFactor == 0 && this.piotroskiFactor == 0 && this.magicFormulaFactor == 100;
  }

  reset() {
    this.levermannFactor = 40;
    this.magicFormulaFactor = 20;
    this.piotroskiFactor = 40;
    this.scores = null;
    this.excludedCountries = null;
    this.excludedBranches = null;
    this.selectedScore = null;
    this.companySize = 0;
    this.msgs = [];
    this.numRows = 10;
  }
}
