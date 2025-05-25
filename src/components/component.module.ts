import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ComponentSchema } from './schema/component.schema';
import { ComponentController } from './component.controller';
import { ComponentService } from './component.service';
import { DescriptionSchema } from 'src/descriptions/schema/description.schema';
import { HistoryModule } from 'src/histories/history.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Component', schema: ComponentSchema },
      { name: 'Description', schema: DescriptionSchema },
    ]),
    HistoryModule,
  ],
  controllers: [ComponentController],
  providers: [ComponentService],
})
export class ComponentModule {}

