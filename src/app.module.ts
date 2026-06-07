import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import config from './utils/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { Auth } from './auth/entities/auth.entity';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { Post } from './post/entities/post.entity';
import { PostModule } from './post/post.module';


@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal:true,
    envFilePath:['.env'],
    load: [config]
  }),

  //database
  TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Hahaha<3',
      database: 'auth', 
      entities:[User, Post],
      synchronize:true
    }),

  ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot:'/uploads'
    }),
  AuthModule,
  UserModule,
PostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
