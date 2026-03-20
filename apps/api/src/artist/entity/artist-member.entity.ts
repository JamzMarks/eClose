import { ArtistMemberRole } from "../types/artist-member-role.type";

export class ArtistMember {
    artistId: string;
    userId: string;
    role: ArtistMemberRole;
    createdAt: Date;
  
    private constructor(props: ArtistMember) {
      Object.assign(this, props);
    }
  
    static create(props: Omit<ArtistMember, 'createdAt'>): ArtistMember {
      if (!props.artistId) throw new Error('ArtistId is required');
      if (!props.userId) throw new Error('UserId is required');
      if (!props.role) throw new Error('Role is required');
  
      return new ArtistMember({
        ...props,
        createdAt: new Date()
      });
    }
  
    isOwner(): boolean {
      return this.role === ArtistMemberRole.OWNER;
    }
  
    promoteToManager() {
      this.role = ArtistMemberRole.MANAGER;
    }
}