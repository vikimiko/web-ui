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

import {AfterViewChecked, ChangeDetectionStrategy, Component, ElementRef, Input} from '@angular/core';
import {Collection} from '../../../../../../core/store/collections/collection';
import {TableHeaderCursor} from '../../../../../../core/store/tables/table-cursor';
import {getTableElement} from '../../../../../../core/store/tables/table.utils';

@Component({
  selector: 'table-caption',
  templateUrl: './table-caption.component.html',
  styleUrls: ['./table-caption.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableCaptionComponent implements AfterViewChecked {
  @Input()
  public collection: Collection;

  @Input()
  public cursor: TableHeaderCursor;

  constructor(private element: ElementRef) {}

  public ngAfterViewChecked() {
    const element = this.element.nativeElement as HTMLElement;
    const height = element.offsetHeight;

    const tableElement = getTableElement(this.cursor.tableId);
    tableElement.style.setProperty('--caption-height', `${height}px`);
  }
}
