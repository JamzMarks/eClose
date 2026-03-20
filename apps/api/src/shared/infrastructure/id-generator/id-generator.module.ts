import { Module } from '@nestjs/common';
import { UuidGenerator } from './uuid-generator';

@Module({
  providers: [
    {
      provide: 'IdGenerator',
      useClass: UuidGenerator
    }
  ],
  exports: ['IdGenerator']
})
export class IdGeneratorModule {}