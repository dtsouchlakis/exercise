import { ActivityDataDto } from './ActivityData.dto';
import { ClimatixService } from './Climatix.service';

describe('ClimatixService', () => {
  const service = new ClimatixService();

  beforeAll(async () => {
    await service.setEmissionFactor({
      activityType: 'gasoline',
      factors: {
        CO2: 69300,
        CH4: 3,
        N2O: 0.6,
      },
    });
    await service.setEmissionFactor({
      activityType: 'lng',
      factors: {
        CO2: 56100,
        CH4: 5,
      },
    });
  });

  it('should calculate emissions for gasoline activity', async () => {
    const testData: ActivityDataDto = {
      amount: 10,
      activityDate: '2023-01-01',
      activityType: 'gasoline',
      emissions: { CO2: 0, CH4: 0, N2O: 0 },
      uuid: '',
    };

    const result = await service.addActivity(testData);

    expect(result.emissions).toEqual({ CO2: 693000, CH4: 30, N2O: 6 });
  });

  it('should calculate emissions for natural gas activity', async () => {
    const testData: ActivityDataDto = {
      amount: 2,
      activityDate: '2023-01-01',
      activityType: 'lng',
      emissions: { CO2: 0, CH4: 0, N2O: 0 },
      uuid: '',
    };

    const result = await service.addActivity(testData);

    expect(result.emissions).toEqual({ CO2: 112200, CH4: 10, N2O: 0 });
  });
});
