import { Body, Controller, HttpCode, NotFoundException, Param, Put, UseGuards, UsePipes } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "src/auth/current-user-decorator";
import { UserPayload } from "src/auth/jwt-strategy";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";

const editEventBodySchema = z.object({
  title: z.string(),
  description: z.string(),
  startTime: z.date(),
  endTime: z.date()
})

type EditEventBodySchema = z.infer<typeof editEventBodySchema>

@Controller('/events/:id')
export class EditEventController {
  constructor(private prisma: PrismaService) {}

  @Put()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(204)
  async handle(@Body() body: EditEventBodySchema,
  @CurrentUser() user: UserPayload,
  @Param('id') id: string) {
    const { title, description, startTime, endTime } = body
    const userId = user.sub
    const event = await this.prisma.event.findUnique({
      where: {
          id,
      },
  });

  if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
  }
  await this.prisma.event.update({
      where: {
        id,
      },
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