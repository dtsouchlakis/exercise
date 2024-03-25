import { v4 as uuidv4 } from 'uuid';
import { ActivityDataDto } from './ActivityData.dto';
import { EmissionFactorDto } from './EmissionFactor.dto';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

const CURRENT_ACTIVITIES = 10;

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

    // Generate random activity data
    const propagateActivities = () => {
      for (let i = 0; i < CURRENT_ACTIVITIES; i++) {
        const uuid = Math.floor(Math.random() * 1000000).toString();
        const amount = Math.floor(Math.random() * 10) + 1;
        const day = Math.floor(Math.random() * 28) + 1;
        const activityDate = `2022-01-${day < 10 ? '0' + day : day}`;
        const activityType = ['gasoline', 'lng'][Math.floor(Math.random() * 2)];
        const emissions = {
          CO2: 0,
          CH4: 0,
          N2O: 0,
        };
        this.addActivity({
          uuid,
          amount,
          activityDate,
          activityType,
          emissions,
        });
      }
    };
    propagateActivities();
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
    this.calculateEmission(activityData);
    // Inserting into DB
    this.activityDb[activityData.uuid] = activityData;

    return activityData;
  }

  // Get all activities with a given date
  async getAllActivitybyDate(date: string): Promise<ActivityDataDto[]> {
    const matchingActivities = Object.values(this.activityDb).filter(
      (activity) => activity.activityDate === date,
    );
    return matchingActivities;
  }

  // Get all activities with a given UUID
  async getAllActivitybyUUID(uuid: string): Promise<ActivityDataDto[]> {
    const matchingActivities = Object.values(this.activityDb).filter(
      (activity) => activity.uuid == uuid,
    );
    return matchingActivities;
  }

  // Get all activity categories
  async getAllActivityCategories(): Promise<string[]> {
    const categories = [];
    Object.values(this.emissionFactorDb).forEach((category) => {
      categories.push(category.activityType);
    });
    return Array.from(categories);
  }

  // Get all activities
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
    for (const factor in emissionFactor.factors) {
      activityData.emissions[factor] =
        emissionFactor.factors[factor] * activityData.amount;
    }

    return activityData;
  }

  //Get the users emission savings and total emissions. The calculation method could probably be improved, but this is a simple way to calculate
  // This code calculates CO2 emission reduction for a list of activities by subtracting previous emissions from current emissions in each loop and adding the result to the emissionReduced variable. Finally, it returns the total emissions and calculated emission reduction.
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
