import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateAccountController } from './controllers/create-account.controller';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env';
import { DeleteAccountController } from './controllers/delete-account.controller';
import { CreateEventController } from './controllers/create-event.controller';
import { AuthenticateController } from './controllers/authenticate.controller';
import { AuthModule } from './auth/auth.module';
import { ShareEventController } from './controllers/share-event.controller';
import { EditEventController } from './controllers/edit-event.controller';
import { DeleteEventController } from './controllers/delete-event.controller';
import { ListEventsController } from './controllers/get-events.controller';

@Module({
  imports: [ConfigModule.forRoot({
    validate: env => envSchema.parse(env),
    isGlobal: true,
  }), AuthModule],
  controllers: [CreateAccountController, DeleteAccountController,
   CreateEventController, AuthenticateController, ShareEventController,
   EditEventController, DeleteEventController, ListEventsController],
  providers: [PrismaService],
})
export class AppModule {}
