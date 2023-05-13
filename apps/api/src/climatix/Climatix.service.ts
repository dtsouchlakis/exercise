import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ActivityDataDto } from './ActivityData.dto';
import { EmissionFactorDto } from './EmissionFactor.dto';

@Injectable()
export class ClimatixService implements OnModuleInit {
  private readonly logger = new Logger(ClimatixService.name);

  // The simplified "database" of the activity that emits gasses
  private activityDb: { [key: string]: ActivityDataDto } = {};

  // Simplified "database"
  private emissionFactorDb: { [activityType: string]: EmissionFactorDto } = {};

  constructor() {}

  async onModuleInit(): Promise<void> {
    this.logger.log('onModuleInit');

    this.setEmissionFactor({
      activityType: 'gasoline',
      factors: {
        CO2: 69300,
        CH4: 3,
        N2O: 0.6,
      },
    });
    this.setEmissionFactor({
      activityType: 'lng',
      factors: {
        CO2: 56100,
        CH4: 5,
      },
    });
    // There are more but for the purpose of assignment, these suffice
  }

  async setEmissionFactor(emissionFactor: EmissionFactorDto) {
    this.emissionFactorDb[emissionFactor.activityType] = emissionFactor;
  }

  /**
   * Calculate emission and add to "database"
   * @param activityData
   */
  async addActivity(activityData: ActivityDataDto): Promise<ActivityDataDto> {
    activityData.uuid = uuidv4();
    // TODO: populate activityData's emissions (hint: use the calculateEmission method)
    this.calculateEmission(activityData);
    // Inserting into DB
    this.activityDb[activityData.uuid] = activityData;

    return activityData;
  }
  async getAllActivitybyDate(date: string): Promise<ActivityDataDto[]> {
    this.logger.log(date);
    const matchingActivities = Object.values(this.activityDb).filter(
      (activity) => activity.activityDate === date,
    );
    return matchingActivities;
  }
  async getAllActivitybyUUID(uuid: string): Promise<ActivityDataDto[]> {
    const matchingActivities = Object.values(this.activityDb).filter(
      (activity) => activity.uuid == uuid,
    );
    return matchingActivities;
  }
  async getAllActivityCategories(): Promise<string[]> {
    this.logger.log(this.emissionFactorDb);
    const categories = [];
    Object.values(this.emissionFactorDb).forEach((category) => {
      Logger.log(category);
      categories.push(category.activityType);
    });
    return Array.from(categories);
  }
  // TODO implement other methods as needed
  async getAllData(): Promise<{
    activities: ActivityDataDto[];
    emissionFactors: EmissionFactorDto[];
  }> {
    const activities = Object.values(this.activityDb);
    const emissionFactors = Object.values(this.emissionFactorDb);
    return { activities, emissionFactors };
  }

  /**
   * Calculates the emission
   * @param activityData
   * @returns
   */
  async calculateEmission(
    activityData: ActivityDataDto,
  ): Promise<ActivityDataDto> {
    const emissionFactor = this.emissionFactorDb[activityData.activityType];
    if (!emissionFactor) {
      throw new Error(
        `No emission factor found for activity type ${activityData.activityType}`,
      );
    }
    this.logger.log(emissionFactor);
    for (const factor in emissionFactor.factors) {
      activityData.emissions[factor] =
        emissionFactor.factors[factor] * activityData.amount;
    }
    this.logger.log(activityData);
    return activityData;
  }
  //Get the users savings from their reduced emissions
  async getSavings(): Promise<{
    totalEmissions: any;
    emissionReduced: number;
  }> {
    const activities = Object.values(this.activityDb);
    let totalEmissions = [];
    activities.forEach((activity) => {
      totalEmissions.push(activity.emissions.CO2);
    });
    totalEmissions = eval(totalEmissions.join('+'));
    let emissionReduced = 0;
    let previousEmission = 0;
    activities.forEach((activity) => {
      if (previousEmission) {
        emissionReduced += activity.emissions.CO2 - previousEmission;
      }
      previousEmission = activity.emissions.CO2;
    });
    return { totalEmissions: totalEmissions, emissionReduced };
  }
}
