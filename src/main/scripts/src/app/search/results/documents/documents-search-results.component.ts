/*
 * -----------------------------------------------------------------------\
 * Lumeer
 *
 * Copyright (C) since 2016 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * -----------------------------------------------------------------------/
 */

import {Component, ComponentFactoryResolver} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';

import {DocumentsPerspectivePresenter} from '../../../shared/perspectives/documents/documents-perspective-presenter';
import {DocumentsPerspective, PERSPECTIVES} from '../../../shared/perspectives/documents/documents-perspective';

@Component({
  templateUrl: './documents-search-results.component.html'
})
export class DocumentsSearchResultsComponent extends DocumentsPerspectivePresenter {

  constructor(activatedRoute: ActivatedRoute,
              componentFactoryResolver: ComponentFactoryResolver,
              private router: Router) {
    super(activatedRoute, componentFactoryResolver);
  }

  public ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((queryParams: ParamMap) => {
      const query = JSON.parse(queryParams.get('query'));
      this.selectedPerspective = PERSPECTIVES[queryParams.get('perspective')] || DocumentsPerspective.PostIt; // TODO change to Search
      this.loadPerspective(this.selectedPerspective, query);
    });
  }

}