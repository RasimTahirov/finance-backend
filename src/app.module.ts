import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AppService } from './app.service';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<'postgres'>('DB_TYPE'),
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        database: configService.get<string>('DB_NAME'),
        password: configService.get<string>('DB_PASSWORD'),
        autoLoadEntities: true,
        entities: [__dirname + '/**/*.entity{.js, .ts}'],
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
