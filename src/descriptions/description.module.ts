import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DescriptionSchema } from './schema/description.schema';
import { DescriptionService } from './description.service';
import { DescriptionController } from './description.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Description', schema: DescriptionSchema }]),
  ],
  controllers: [DescriptionController],
  providers: [DescriptionService],
})
export class DescriptionModule {}