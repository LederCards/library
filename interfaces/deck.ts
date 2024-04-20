
export interface IDeckRevision {
  id: string;
  originalCreatedAt: number;
  cards: Record<string, number>;
}

export interface IDeck {

  id?: string;

  author?: any;
  authorId?: string;

  // if this was remixed from somewhere
  parent?: IDeck;
  parentId?: string;
  parentRevision?: string;

  // if the deck is private
  isPrivate?: boolean;

  // if the deck is soft-deleted
  isDeleted?: boolean;

  // these are automatically set server side when the appropriate event happens
  createdAt?: number;
  updatedAt?: number;
  expansions?: string[];
  revisions: IDeckRevision[];

  // user-editable
  name: string;
  description: string;
  cards: Record<string, number>;
};
