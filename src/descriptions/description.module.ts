import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DescriptionSchema } from './schema/description.schema';
import { DescriptionService } from './description.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Description', schema: DescriptionSchema }]),
  ],
  providers: [DescriptionService],
  exports: [DescriptionService],
})
export class DescriptionModule {}