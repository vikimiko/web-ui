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

import {} from 'jasmine';
import {User} from '../users/user';
import {DocumentModel} from './document.model';
import {filterDocumentsByQuery} from './documents.filters';
import {Collection} from '../collections/collection';

const documents: DocumentModel[] = [
  {
    collectionId: 'COMPANIES_COLLECTION',
    id: 'IBM_DOCUMENT',
    data: {
      a1: 'IBM',
    },
  },
  {
    collectionId: 'COMPANIES_COLLECTION',
    id: 'REDHAT_DOCUMENT',
    data: {
      a1: 'Red Hat',
      a2: 'aturing@lumeer.io',
    },
    metaData: {
      parentId: 'IBM_DOCUMENT',
    },
  },
  {
    collectionId: 'COMPANIES_COLLECTION',
    id: 'JBOSS_DOCUMENT',
    data: {
      a1: 'JBoss',
    },
    metaData: {
      parentId: 'REDHAT_DOCUMENT',
    },
  },
  {
    collectionId: 'COMPANIES_COLLECTION',
    id: 'SOFTLAYER_DOCUMENT',
    data: {
      a1: 'SoftLayer',
    },
    metaData: {
      parentId: 'IBM_DOCUMENT',
    },
  },
  {
    collectionId: 'COMPANIES_COLLECTION',
    id: 'MICROSOFT_DOCUMENT',
    data: {
      a1: 'Microsoft',
    },
  },
  {
    collectionId: 'COMPANIES_COLLECTION',
    id: 'LINKEDIN_DOCUMENT',
    data: {
      a1: 'LinkedIn',
    },
    metaData: {
      parentId: 'MICROSOFT_DOCUMENT',
    },
  },
  {
    collectionId: 'BANDS_COLLECTION',
    id: 'RHCP_DOCUMENT',
    data: {
      a1: 'Red Hot Chili Peppers',
      a2: 'music@lumeer.io',
    },
  },
  {
    collectionId: 'BANDS_COLLECTION',
    id: 'LINKIN_PARK_DOCUMENT',
    data: {
      a1: 'Linkin Park',
      a2: 'music@lumeer.io',
    },
  },
];

const collections: Collection[] = [
  {
    id: 'COMPANIES_COLLECTION',
    name: 'collection',
    attributes: [{id: 'a1', name: 'a1'}, {id: 'a2', name: 'a2'}],
  },
  {
    id: 'BANDS_COLLECTION',
    name: 'collection',
    attributes: [{id: 'a1', name: 'a1'}, {id: 'a2', name: 'a2'}],
  },
];

const turingUser: User = {
  email: 'aturing@lumeer.io',
  groupsMap: {},
};

const musicUser: User = {
  email: 'music@lumeer.io',
  groupsMap: {},
};

describe('Document filters', () => {
  it('should filter empty documents by undefined query', () => {
    expect(filterDocumentsByQuery([], [], [], [], undefined, undefined)).toEqual([]);
  });

  it('should filter empty documents by empty query', () => {
    expect(filterDocumentsByQuery([], [], [], [], {}, undefined)).toEqual([]);
  });

  it('should not filter documents by empty query', () => {
    expect(filterDocumentsByQuery(documents, [], [], [], {}, undefined)).toEqual(documents);
  });

  it('should not filter documents by empty collections', () => {
    expect(filterDocumentsByQuery(documents, collections, [], [], {stems: []}, undefined)).toEqual(documents);
  });

  it('should not filter documents by all collections', () => {
    expect(
      filterDocumentsByQuery(
        documents,
        collections,
        [],
        [],
        {stems: [{collectionId: 'COMPANIES_COLLECTION'}, {collectionId: 'BANDS_COLLECTION'}]},
        undefined
      )
    ).toEqual(documents);
  });

  it('should filter documents by single collection', () => {
    expect(
      filterDocumentsByQuery(
        documents,
        collections,
        [],
        [],
        {stems: [{collectionId: 'COMPANIES_COLLECTION'}]},
        undefined
      ).length
    ).toBe(6);
  });

  it('should filter document by attribute value', () => {
    expect(
      filterDocumentsByQuery(
        documents,
        collections,
        [],
        [],
        {
          stems: [
            {
              collectionId: 'COMPANIES_COLLECTION',
              filters: [{collectionId: 'COMPANIES_COLLECTION', attributeId: 'a1', condition: '=', value: 'IBM'}],
            },
          ],
        },
        undefined
      ).map(document => document.id)
    ).toEqual(['IBM_DOCUMENT']);
  });

  it('should filter by attribute value with userEmail() function and not existing user', () => {
    expect(
      filterDocumentsByQuery(
        documents,
        collections,
        [],
        [],
        {
          stems: [
            {
              collectionId: 'COMPANIES_COLLECTION',
              filters: [
                {collectionId: 'COMPANIES_COLLECTION', attributeId: 'a2', condition: '=', value: 'userEmail()'},
              ],
            },
          ],
        },
        null
      ).map(document => document.id)
    ).toEqual([]);
  });

  it('should filter document by attribute value with userEmail() function', () => {
    expect(
      filterDocumentsByQuery(
        documents,
        collections,
        [],
        [],
        {
          stems: [
            {
              collectionId: 'COMPANIES_COLLECTION',
              filters: [
                {collectionId: 'COMPANIES_COLLECTION', attributeId: 'a2', condition: '=', value: 'userEmail()'},
              ],
            },
          ],
        },
        turingUser
      ).map(document => document.id)
    ).toEqual(['REDHAT_DOCUMENT']);
  });

  it('should not filter document by attribute value from other collection with userEmail() function', () => {
    expect(
      filterDocumentsByQuery(
        documents,
        collections,
        [],
        [],
        {
          stems: [
            {
              collectionId: 'BANDS_COLLECTION',
              filters: [{collectionId: 'BANDS_COLLECTION', attributeId: 'a2', condition: '=', value: 'userEmail()'}],
            },
          ],
        },
        turingUser
      ).map(document => document.id)
    ).toEqual([]);
  });

  it('should filter two documents by attribute value with userEmail() function', () => {
    expect(
      filterDocumentsByQuery(
        documents,
        collections,
        [],
        [],
        {
          stems: [
            {
              collectionId: 'BANDS_COLLECTION',
              filters: [{collectionId: 'BANDS_COLLECTION', attributeId: 'a2', condition: '=', value: 'userEmail()'}],
            },
          ],
        },
        musicUser
      ).map(document => document.id)
    ).toEqual(['RHCP_DOCUMENT', 'LINKIN_PARK_DOCUMENT']);
  });

  it('should filter child documents by attribute value with userEmail() function', () => {
    expect(
      filterDocumentsByQuery(
        documents,
        collections,
        [],
        [],
        {
          stems: [
            {
              collectionId: 'COMPANIES_COLLECTION',
              filters: [
                {collectionId: 'COMPANIES_COLLECTION', attributeId: 'a2', condition: '=', value: 'userEmail()'},
              ],
            },
          ],
        },
        turingUser,
        true
      ).map(document => document.id)
    ).toEqual(['REDHAT_DOCUMENT', 'JBOSS_DOCUMENT']);
  });

  it('should filter children together with parent document by attribute values', () => {
    expect(
      filterDocumentsByQuery(
        documents,
        collections,
        [],
        [],
        {
          stems: [
            {
              collectionId: 'COMPANIES_COLLECTION',
              filters: [{collectionId: 'COMPANIES_COLLECTION', attributeId: 'a1', condition: '=', value: 'IBM'}],
            },
          ],
        },
        undefined,
        true
      ).map(document => document.id)
    ).toEqual(['IBM_DOCUMENT', 'REDHAT_DOCUMENT', 'JBOSS_DOCUMENT', 'SOFTLAYER_DOCUMENT']);
  });

  it('should filter children together with nested parent document by attribute values', () => {
    expect(
      filterDocumentsByQuery(
        documents,
        collections,
        [],
        [],
        {
          stems: [
            {
              collectionId: 'COMPANIES_COLLECTION',
              filters: [{collectionId: 'COMPANIES_COLLECTION', attributeId: 'a1', condition: '=', value: 'Red Hat'}],
            },
          ],
        },
        undefined,
        true
      ).map(document => document.id)
    ).toEqual(['REDHAT_DOCUMENT', 'JBOSS_DOCUMENT']);
  });

  it('should filter documents from both collections by fulltext', () => {
    expect(
      filterDocumentsByQuery(documents, collections, [], [], {fulltexts: ['link']}, undefined).map(
        document => document.id
      )
    ).toEqual(['LINKEDIN_DOCUMENT', 'LINKIN_PARK_DOCUMENT']);
  });

  it('should filter documents from single collection by collection and fulltext', () => {
    expect(
      filterDocumentsByQuery(
        documents,
        collections,
        [],
        [],
        {stems: [{collectionId: 'COMPANIES_COLLECTION'}], fulltexts: ['link']},
        undefined
      ).map(document => document.id)
    ).toEqual(['LINKEDIN_DOCUMENT']);
  });

  it('should filter children together with parent document by fulltext', () => {
    expect(
      filterDocumentsByQuery(documents, collections, [], [], {fulltexts: ['IBM']}, undefined, true).map(
        document => document.id
      )
    ).toEqual(['IBM_DOCUMENT', 'REDHAT_DOCUMENT', 'JBOSS_DOCUMENT', 'SOFTLAYER_DOCUMENT']);
  });

  it('should filter only matching document without children by fulltext', () => {
    expect(
      filterDocumentsByQuery(documents, collections, [], [], {fulltexts: ['red']}, undefined).map(
        document => document.id
      )
    ).toEqual(['REDHAT_DOCUMENT', 'RHCP_DOCUMENT']);
  });

  it('should filter children together with nested parent document by fulltext', () => {
    expect(
      filterDocumentsByQuery(documents, collections, [], [], {fulltexts: ['red']}, undefined, true).map(
        document => document.id
      )
    ).toEqual(['REDHAT_DOCUMENT', 'JBOSS_DOCUMENT', 'RHCP_DOCUMENT']);
  });
});
