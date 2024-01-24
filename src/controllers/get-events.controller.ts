import { Body, Controller, Get, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "src/auth/current-user-decorator";
import { UserPayload } from "src/auth/jwt-strategy";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";

const listEventsBodySchema = z.object({
  title: z.string(),
  description: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  users: z.array(z.string())
})

type CreateEventBodySchema = z.infer<typeof listEventsBodySchema>


@Controller('/events')
@UseGuards(AuthGuard('jwt'))
export class ListEventsController {
    constructor(private prisma: PrismaService) {}
 @Get()
  async handle(@CurrentUser() user: UserPayload,
  @Param('id') id: string) {
   
    const userId = user.sub
    const events = await this.prisma.event.findMany({
      where: {
        createdByUserId: userId,
      },
    });
    return events
}
  }