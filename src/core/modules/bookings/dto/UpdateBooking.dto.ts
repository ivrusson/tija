import { Type } from "class-transformer";
import { IsEnum, IsString, ValidateNested } from "class-validator";

enum StatusBookingUpdate {
  InProgress = "In Progress",
  Cancelled = 'Cancelled',
}

class DateBookingUpdate {
  @IsString()
  start: string;
  @IsString()
  end?: string;
  @IsString()
  time_zone?: string;
}

export class UpdateBookingDto {
  @IsEnum(StatusBookingUpdate)
  status?: string;

  @ValidateNested()
  @Type(() => DateBookingUpdate)
  date?: DateBookingUpdate
}