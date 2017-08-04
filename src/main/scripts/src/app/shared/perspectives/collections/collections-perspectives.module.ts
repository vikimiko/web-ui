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

import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {PostItCollectionsPerspectiveComponent} from './post-it/post-it-collections-perspective.component';
import {IconPickerModule} from '../icon-picker/icon-picker.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IconPickerModule
  ],
  declarations: [
    PostItCollectionsPerspectiveComponent
  ],
  entryComponents: [
    PostItCollectionsPerspectiveComponent
  ]
})
export class CollectionsPerspectivesModule {

}