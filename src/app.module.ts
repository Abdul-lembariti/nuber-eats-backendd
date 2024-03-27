import { Module, UnauthorizedException } from '@nestjs/common';
import { GraphQLModule, Subscription } from '@nestjs/graphql';
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
import { PaymentsModule } from './payments/payments.module';
import { Payment } from './payments/entities/payment.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
      }),
    }),
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
        Payment,
      ],
    }),

    GraphQLModule.forRoot({
      autoSchemaFile: true,
      cors: {
        origin: [
          'http://localhost:3000',
          'http://127.0.0.1:3000',
          'https://studio.apollographql.com',
        ],
        credentials: true,
      },
      introspection: true,
      playground: true,
      installSubscriptionHandlers: true,
      connectToDevTools: true,
      driver: ApolloDriver,
      context: ({ req, connection }) => {
        const TOKEN_KEY = 'x-jwt';
        return {
          token: req ? req.headers[TOKEN_KEY] : connection.context[TOKEN_KEY],
        };
      },
    }),

    ScheduleModule.forRoot(),
    JwtModule.forRoot({
      privateKey: 'VHtIWhB0DjrRGNlN5j8Ywf2943OaLxZt',
    }),
    MailModule.forRoot({
      apiKey: '1485f3d73723630e87edea445a38b896-309b0ef4-173d60e7',
      domain: 'sandbox75959a9de82a423e95116b8af8deddbb.mailgun.org',
      fromEmail: 'ca987829@gmail.com',
    }),
    AuthModule,
    UsersModule,
    RestaurantsModule,
    OrdersModule,
    CommonModule,
    PaymentsModule,
    UploadsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
