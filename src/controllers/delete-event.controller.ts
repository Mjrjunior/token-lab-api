import { Controller, Delete, Param, NotFoundException, HttpCode, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { PrismaService } from "src/prisma/prisma.service";

@Controller('/events/:id')
@UseGuards(AuthGuard('jwt'))
export class DeleteEventController {
    constructor(private prisma: PrismaService) {}

    @Delete()
    @HttpCode(204)
    async handle(@Param('id') id: string) {

        const event = await this.prisma.event.findUnique({
            where: {
                id,
            },
        });

        if (!event) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        await this.prisma.event.delete({
            where: {
                id,
            },
        });
    }
  }