import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ComponentSchema } from './schema/component.schema';
import { ComponentController } from './component.controller';
import { ComponentService } from './component.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Component', schema: ComponentSchema }])
  ],
  controllers: [ComponentController],
  providers: [ComponentService],
})
export class ComponentModule {}
