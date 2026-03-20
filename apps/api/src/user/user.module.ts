import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { IdGeneratorModule } from '@/shared/infrastructure/id-generator/id-generator.module';

@Module({
  imports: [IdGeneratorModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
