import { Type } from "class-transformer";
import { IsString, ValidateNested } from "class-validator";

type StatusBookingUpdate = 'In Progress' | 'Cancelled';

class DateBookingUpdate {
  @IsString()
  start: string;
  @IsString()
  end?: string;
  @IsString()
  time_zone?: string;
}

export class UpdateBookingDto {
  Status?: {
    status: {
      name: StatusBookingUpdate;
    };
  };

  @ValidateNested()
  @Type(() => DateBookingUpdate)
  Date?: DateBookingUpdate
}