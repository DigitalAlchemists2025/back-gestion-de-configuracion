import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { HistorySchema } from './schema/history.schema';
import { ComponentSchema } from 'src/components/schema/component.schema';
import { UserSchema } from 'src/users/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'History', schema: HistorySchema },
      { name: 'Component', schema: ComponentSchema },
      { name: 'User', schema: UserSchema }
    ]),
  ],
  controllers: [HistoryController],
  exports: [HistoryService],
  providers: [HistoryService],
})
export class HistoryModule {}
