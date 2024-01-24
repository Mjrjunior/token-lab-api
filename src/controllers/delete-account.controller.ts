import { Controller, Delete, Param, NotFoundException, HttpCode, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { PrismaService } from "src/prisma/prisma.service";

@Controller('/accounts/:id')
@UseGuards(AuthGuard('jwt'))
export class DeleteAccountController {
    constructor(private prisma: PrismaService) {}

    @Delete()
    @HttpCode(204)
    async handle(@Param('id') id: string) {

        const user = await this.prisma.user.findUnique({
            where: {
                id,
            },
        });

        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        await this.prisma.user.delete({
            where: {
                id,
            },
        });
    }
  }