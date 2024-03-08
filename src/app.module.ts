import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { Restaurant } from './restaurants/entitie/restaurants.enitites';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { User } from './users/entities/user.entity';
import { JwtModule } from './jwt/jwt.module';
import { JwtMiddleware } from './jwt/jwt.middlewares';
import { AuthModule } from './auth/auth.module';
import { Verification } from './users/entities/verfication.entity';
import { MailModule } from './mail/mail.module';
import { Category } from './restaurants/entitie/category.entity';
import { Dish } from './restaurants/entitie/dish.entity';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/order.enitity';
import { OrderItem } from './orders/entities/order-item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
        //  DB_HOST: Joi.string().required(),
        // DB_PORT: Joi.string().required(),
        // DB_USERNAME: Joi.string().required(),
        // DB_PASSWORD: Joi.string().required(),
        // DB_NAME: Joi.string().required(),
        // SECRET_KEY: Joi.string().required(),
        // MAILGUN_API_KEY: Joi.string().required(),
        // FROMEMAIL: Joi.string().required(),
        // DOMAIN: Joi.string().required(),
      }),
    }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'Admin',
    //   password: 'Admin',
    //   database: 'NuberEats',
    //   synchronize: process.env.NODE_ENV !== 'prod',
    //   logging: process.env.NODE_ENV !== 'prod',
    //   entities: [User, Verification, Restaurant, Category],
    // }),

    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      synchronize: process.env.NODE_ENV !== 'prod',
      logging: process.env.NODE_ENV !== 'prod',
      entities: [
        User,
        Verification,
        Restaurant,
        Category,
        Dish,
        Order,
        OrderItem,
      ],
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: true,
      driver: ApolloDriver,
      context: ({ req }) => ({ user: req['user'] }),
    }),
    JwtModule.forRoot({
      privateKey: 'VHtIWhB0DjrRGNlN5j8Ywf2943OaLxZt',
    }),
    MailModule.forRoot({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.DOMAIN,
      fromEmail: process.env.FROMEMAIL,
    }),
    AuthModule,
    UsersModule,
    RestaurantsModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes({
      path: '/graphql',
      method: RequestMethod.POST,
    });
  }
}
