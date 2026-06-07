import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreatePostDto {
  @ApiProperty({ example: 'My First Post' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'This is the post content, at least 10 chars.' })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  content!: string;
}