/*
 * Lumeer: Modern Data Definition and Processing Platform
 *
 * Copyright (C) since 2017 Answer Institute, s.r.o. and/or its affiliates.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {DocumentModel} from '../../../core/store/documents/document.model';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../core/store/app.state';
import {selectQuery} from '../../../core/store/navigation/navigation.state';
import {DocumentsAction} from '../../../core/store/documents/documents.action';
import {selectCollectionsByQuery, selectDocumentsByQuery} from '../../../core/store/common/permissions.selectors';
import {Collection} from '../../../core/store/collections/collection';
import {distinctUntilChanged, filter, map, take, withLatestFrom} from 'rxjs/operators';
import {ChartConfig, ChartType, DEFAULT_CHART_ID} from '../../../core/store/charts/chart';
import {selectChartById, selectChartConfig, selectDefaultChart} from '../../../core/store/charts/charts.state';
import {View, ViewConfig} from '../../../core/store/views/view';
import {selectCurrentView} from '../../../core/store/views/views.state';
import {ChartAction} from '../../../core/store/charts/charts.action';
import {Query} from '../../../core/store/navigation/query';

@Component({
  selector: 'chart-perspective',
  templateUrl: './chart-perspective.component.html',
  styleUrls: ['./chart-perspective.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartPerspectiveComponent implements OnInit, OnDestroy {
  public documents$: Observable<DocumentModel[]>;
  public collection$: Observable<Collection>;
  public config$: Observable<ChartConfig>;
  public currentView$: Observable<View>;

  public query$ = new BehaviorSubject<Query>(null);

  private chartId = DEFAULT_CHART_ID;
  private subscriptions = new Subscription();

  constructor(private store$: Store<AppState>) {}

  public ngOnInit() {
    this.initChart();
    this.subscribeToQuery();
    this.subscribeData();
  }

  private subscribeToQuery() {
    const subscription = this.store$.pipe(select(selectQuery)).subscribe(query => {
      this.query$.next(query);
      this.fetchDocuments(query);
    });
    this.subscriptions.add(subscription);
  }

  private fetchDocuments(query: Query) {
    this.store$.dispatch(new DocumentsAction.Get({query}));
  }

  private initChart() {
    const subscription = this.store$
      .pipe(
        select(selectCurrentView),
        filter(view => !!view),
        withLatestFrom(this.store$.pipe(select(selectChartById(this.chartId))))
      )
      .subscribe(([view, chart]) => {
        if (chart) {
          this.refreshChart(view.config);
        } else {
          this.createChart(view.config);
        }
      });
    this.subscriptions.add(subscription);
  }

  private refreshChart(viewConfig: ViewConfig) {
    if (viewConfig && viewConfig.chart) {
      this.store$.dispatch(new ChartAction.SetConfig({chartId: this.chartId, config: viewConfig.chart}));
    }
  }

  private createChart(viewConfig: ViewConfig) {
    const config = (viewConfig && viewConfig.chart) || this.createDefaultConfig();
    const chart = {id: this.chartId, config};
    this.store$.dispatch(new ChartAction.AddChart({chart}));
  }

  private createDefaultConfig(): ChartConfig {
    return {type: ChartType.Line, axes: {}};
  }

  private subscribeData() {
    this.documents$ = this.store$.pipe(
      select(selectDocumentsByQuery),
      distinctUntilChanged((x, y) => JSON.stringify(x) === JSON.stringify(y))
    );
    this.collection$ = this.store$.pipe(
      select(selectCollectionsByQuery),
      map(collections => collections[0])
    );
    this.config$ = this.store$.pipe(select(selectChartConfig));
    this.currentView$ = this.store$.pipe(select(selectCurrentView));
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.store$.dispatch(new ChartAction.RemoveChart({chartId: this.chartId}));
  }

  public onConfigChanged(config: ChartConfig) {
    this.store$.dispatch(new ChartAction.SetConfig({chartId: this.chartId, config}));
  }

  public patchDocumentData(document: DocumentModel) {
    this.store$.dispatch(new DocumentsAction.PatchData({document}));
  }
}
