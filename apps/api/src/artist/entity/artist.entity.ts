import { ArtistType } from "../types/artist.type";

export class Artist {
    id: string;
    name: string;
    slug: string;
    type: ArtistType;
    ownerId: string;
    createdAt: Date;
    isActive: boolean;
  
    private constructor(props: Artist) {
      Object.assign(this, props);
    }
  
    static create(props: Omit<Artist, 'createdAt' | 'isActive'>): Artist {
      if (!props.id) throw new Error('Id is required');
      if (!props.name) throw new Error('Name is required');
      if (!props.slug) throw new Error('Slug is required');
      if (!props.type) throw new Error('Type is required');
      if (!props.ownerId) throw new Error('Owner is required');
  
      return new Artist({
        ...props,
        createdAt: new Date(),
        isActive: true
      });
    }
  
    rename(name: string) {
      if (!name) throw new Error('Name is required');
      this.name = name;
    }
  
    deactivate() {
      this.isActive = false;
    }
}