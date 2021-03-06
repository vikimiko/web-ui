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

import {Pipe, PipeTransform} from '@angular/core';
import {Perspective} from '../../view/perspectives/perspective';
import {Query} from '../../core/store/navigation/query';
import {isAnyCollectionQuery, isSingleCollectionQuery} from '../../core/store/navigation/query.util';

@Pipe({
  name: 'filterPerspectives',
})
export class FilterPerspectivesPipe implements PipeTransform {
  public transform(perspectives: Perspective[], query: Query): Perspective[] {
    return perspectives.filter(perspective => canShowPerspective(perspective, query));
  }
}

function canShowPerspective(perspective: Perspective, query: Query): boolean {
  switch (perspective) {
    case Perspective.Table:
    case Perspective.Chart:
      return isSingleCollectionQuery(query);
    case Perspective.Map:
      return isAnyCollectionQuery(query);
    case Perspective.SmartDoc:
      return false;
    default:
      return true;
  }
}
