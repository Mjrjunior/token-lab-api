import { Body, ConflictException, Controller, Post, UseGuards, UsePipes } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "src/auth/current-user-decorator";
import { UserPayload } from "src/auth/jwt-strategy";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";

const createEventBodySchema = z.object({
  title: z.string(),
  description: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  users: z.array(z.string())
})

type CreateEventBodySchema = z.infer<typeof createEventBodySchema>


@Controller('/events')
@UseGuards(AuthGuard('jwt'))
export class CreateEventController {
    constructor(private prisma: PrismaService) {}
 @Post()
  async handle(
    @Body() body: CreateEventBodySchema,
    @CurrentUser() user: UserPayload,) {
    const { title, description, startTime, endTime } = body
    const userId = user.sub

    const existingEvent = await this.prisma.event.findFirst({
      where: {
        OR: [
          {
            startTime: {
              gte: new Date(startTime),
              lt: new Date(endTime),
            },
          },
          {
            endTime: {
              gt: new Date(startTime),
              lte: new Date(endTime),
            },
          },
          {
            startTime: {
              lte: new Date(startTime),
            },
            endTime: {
              gte: new Date(endTime),
            },
          },
        ],
      },
    });

    if (existingEvent) {
      throw new ConflictException('There is already an event in this time range.')
    }

    await this.prisma.event.create({
      data: {
        title,
        description, 
        startTime,
        endTime,
        createdByUserId: userId,
          },
    })    
}
  }