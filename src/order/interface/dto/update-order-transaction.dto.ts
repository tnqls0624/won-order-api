import { ApiProperty } from "@nestjs/swagger";

export class UpdateOrderTransactionDto {
  @ApiProperty({ description: '주문 ID', type: String, required: false })
  tran_id: string;

  @ApiProperty({ description: '금액', type: String, required: false })
  apv: string;

  @ApiProperty({ description: '스테이터스', type: Number, required: false })
  status: number;

}
