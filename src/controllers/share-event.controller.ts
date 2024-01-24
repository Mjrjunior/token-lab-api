import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { User } from "@prisma/client";
import { CurrentUser } from "src/auth/current-user-decorator";
import { UserPayload } from "src/auth/jwt-strategy";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";

const shareEventBodySchema = z.object({
  email: z.string(),
  eventId: z.string(),
  senderId: z.string(),
  receiverId: z.string(),
})

type ShareEventBodySchema = z.infer<typeof shareEventBodySchema>


@Controller('/share-event')
@UseGuards(AuthGuard('jwt'))
export class ShareEventController {
  constructor(private prisma: PrismaService) {}
  @Post()
  async handle(@Body() body: ShareEventBodySchema,
  @CurrentUser() senderUser: UserPayload) {
    const { email, eventId} = body
    const senderId = senderUser.sub
    
  const user = await this.prisma.user.findUnique({
      where:{
        email,
      }
    })

    if(!user){
      throw new Error('User not found')
    }

    const eventShare = await this.prisma.eventShare.create({
      data: {
        eventId,
        senderId: senderId,
        receiverId: user.id,
        status: 'PENDING'
      }
    });
  
    return eventShare;
}
}