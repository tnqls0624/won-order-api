import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString } from "class-validator";

export class DeleteReceiptDto {
  @ApiProperty({ description: '영수증 출력 ids', type: Array, required: false, isArray: true, example: [1, 2] })
  @IsArray()
  ids: number[];
}
