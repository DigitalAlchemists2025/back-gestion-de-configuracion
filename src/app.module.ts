import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ComponentModule } from './components/component.module';
import { HistoryModule } from './histories/history.module';

@Module({
  imports: [
    // Cargar variables de entorno
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local'],
      isGlobal: true,
    }),
    // Conexión a MongoDB
    MongooseModule.forRoot(process.env.DB_URI),
    AuthModule,
    UserModule,
    ComponentModule,
    HistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
