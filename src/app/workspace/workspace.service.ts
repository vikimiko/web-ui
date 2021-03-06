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

import {Injectable} from '@angular/core';

import {of, Observable} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {catchError, map, mergeMap, take, tap} from 'rxjs/operators';
import {OrganizationService, ProjectService} from '../core/rest';
import {AppState} from '../core/store/app.state';
import {OrganizationConverter} from '../core/store/organizations/organization.converter';
import {Organization} from '../core/store/organizations/organization';
import {OrganizationsAction} from '../core/store/organizations/organizations.action';
import {selectAllOrganizations} from '../core/store/organizations/organizations.state';
import {ProjectConverter} from '../core/store/projects/project.converter';
import {Project} from '../core/store/projects/project';
import {ProjectsAction} from '../core/store/projects/projects.action';
import {selectAllProjects} from '../core/store/projects/projects.state';
import {isNullOrUndefined} from '../shared/utils/common.utils';

@Injectable()
export class WorkspaceService {
  constructor(
    private organizationService: OrganizationService,
    private projectService: ProjectService,
    private store$: Store<AppState>
  ) {}

  public getOrganizationFromStoreOrApi(code: string): Observable<Organization> {
    return this.getOrganizationFromStore(code).pipe(
      mergeMap(organization => {
        if (!isNullOrUndefined(organization)) {
          return of(organization);
        }
        return this.getOrganizationFromApi(code);
      })
    );
  }

  private getOrganizationFromStore(code: string): Observable<Organization> {
    return this.store$.pipe(
      select(selectAllOrganizations),
      map(organizations => organizations.find(org => org.code === code)),
      take(1)
    );
  }

  private getOrganizationFromApi(code: string): Observable<Organization> {
    return this.organizationService.getOrganization(code).pipe(
      map(organization => OrganizationConverter.fromDto(organization)),
      tap(organization => this.store$.dispatch(new OrganizationsAction.GetOneSuccess({organization}))),
      catchError(() => {
        return of(undefined);
      })
    );
  }

  public getProjectFromStoreOrApi(orgCode: string, orgId: string, projCode: string): Observable<Project> {
    return this.getProjectFromStore(projCode).pipe(
      mergeMap(project => {
        if (!isNullOrUndefined(project)) {
          return of(project);
        }
        return this.getProjectFromApi(orgCode, orgId, projCode);
      })
    );
  }

  private getProjectFromStore(code: string): Observable<Project> {
    return this.store$.pipe(
      select(selectAllProjects),
      map(projects => projects.find(proj => proj.code === code)),
      take(1)
    );
  }

  private getProjectFromApi(orgCode: string, orgId: string, projCode: string): Observable<Project> {
    return this.projectService.getProject(orgCode, projCode).pipe(
      map(project => ProjectConverter.fromDto(project, orgId)),
      tap(project => this.store$.dispatch(new ProjectsAction.GetOneSuccess({project}))),
      catchError(() => {
        return of(undefined);
      })
    );
  }
}
