import { Body, Controller, Post, UnauthorizedException, UsePipes } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcryptjs";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";

const autheticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof autheticateBodySchema>


@Controller('/sessions')
export class AuthenticateController {
  constructor(private jwt: JwtService, private prisma: PrismaService){}

  @Post()
  @UsePipes(new ZodValidationPipe(autheticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const {email, password} = body
    
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      }
    })

    if (!user) {
      throw new UnauthorizedException('User credentials are invalid.')
    }

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      throw new UnauthorizedException('User credentials are invalid.')
    }

    const acessToken = this.jwt.sign({sub: user.id})
    return {
      access_token: acessToken,
      user: {
        id: user.id,
        name: user.name,
 
      }
    }
  }
}