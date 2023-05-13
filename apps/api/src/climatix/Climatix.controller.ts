import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ActivityDataDto } from './ActivityData.dto';
import { ClimatixService } from './Climatix.service';

@Controller('climatix')
@ApiTags('climatix')
export class ClimatixController {
  private readonly logger = new Logger(ClimatixController.name);

  constructor(private readonly climatixService: ClimatixService) {}

  @Get('/info')
  async getInfo(@Req() req: any): Promise<{ message: string }> {
    return {
      message: 'I am alive!',
    };
  }

  @Get('/data')
  async getAllData(@Req() req: any): Promise<{
    activities: ActivityDataDto[];
  }> {
    const data = await this.climatixService.getAllData();
    return data;
  }

  @Post('/activities')
  async addActivity(
    @Req() req: any,
    @Body() data: ActivityDataDto,
  ): Promise<ActivityDataDto> {
    try {
      // Sanitize user input
      const sanitizedData = {
        ...data,
        amount: parseInt(data.amount.toString()),
        activityDate: data.activityDate.toString(),
      };
      // Add activity to database
      const result = await this.climatixService.addActivity(sanitizedData);
      return result;
    } catch (error) {
      // Handle errors and return them to the frontend
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal Server Error',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // Endpoint to get all activityData of given date or uuid
  @Get('/activities')
  async getActivity(
    @Req() req: any,
    @Query('date') date: string,
    @Query('uuid') uuid: string,
  ): Promise<ActivityDataDto[]> {
    try {
      if (date) {
        // Retrieve activity data by date only
        const data = await this.climatixService.getAllActivitybyDate(date);
        return data;
      } else if (uuid) {
        // Retrieve activity data by UUID only
        const data = await this.climatixService.getAllActivitybyUUID(uuid);
        return data;
      } else {
        // No query parameters specified
        throw new BadRequestException('No query parameters specified');
      }
    } catch (error) {
      // Handle errors and return them to the frontend
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal Server Error',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
  @Get('/savings')
  async getSavings(
    @Req() req: any,
  ): Promise<{ totalEmissions: Array<number>; emissionReduced: number }> {
    const savings = await this.climatixService.getSavings();
    return savings;
  }
  @Get('/categories')
  async getCategories(@Req() req: any): Promise<string[]> {
    const categories = await this.climatixService.getAllActivityCategories();
    return categories;
  }
}
