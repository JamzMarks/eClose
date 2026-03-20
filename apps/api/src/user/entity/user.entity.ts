export class User {
    id: string;
    email: string;
    password: string;
  
    firstName: string;
    lastName: string;
    phone?: string;
    bio?: string;
  
    birthDate: Date;
  
    isActive: boolean;
    createdAt: Date;
  
    private constructor(props: User) {
      Object.assign(this, props);
    }
  
    static create(props: Omit<User, 'createdAt' | 'isActive'>): User {
      
      if (!props.email) throw new Error('Email is required');
      if (!props.password) throw new Error('Password is required');
      if (!props.firstName) throw new Error('First name is required');
      if (!props.lastName) throw new Error('Last name is required');
      if (!props.birthDate) throw new Error('Birth date is required');
  
      const user = new User({
        ...props,
        id: props.id,
        isActive: true,
        createdAt: new Date()
      });
    
      return user;
    }
  
    getAge(): number {
      const today = new Date();
      let age = today.getFullYear() - this.birthDate.getFullYear();
  
      const monthDiff = today.getMonth() - this.birthDate.getMonth();
      const dayDiff = today.getDate() - this.birthDate.getDate();
  
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
      }
  
      return age;
    }
  
}