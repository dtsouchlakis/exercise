## Fullstack Webdev assignment README
![image](https://github.com/dtsouchlakis/assignment-fullstack-diot/assets/35729258/854a8ad3-c1ff-4d6a-9384-8c5bfe689483)

## Short Explanation

This assignment involves the development of a web application called Climatix, which allows the users to keep track of their emissions and promotes sustainability. The application allows users to track their activities and calculate the corresponding carbon emissions. It also provides insights and progress towards emission reduction goals.

## Assumptions

- The emissions are calculated using the simplified estimate equation: E = A \* EF, where E is the emissions, A is the activity rate, and EF is the emission factor.
- For the first page of the dashboard, where the user can see their progress and milestones, only CO2 is currently tracked
- The application assumes a fixed conversion rate of 1 tonne of CO2 equivalent per 40 trees for calculating the equivalent number of trees planted.
- Currently the user input is in TJ, but this could be improved by changing the units according to the activity type. A unit such as liters or m3 for gas would potentially be more useable
- The calculation for the emission reduction is rather simplistic, and surely there is a better way, but depends on which periods we want to compare, i.e. yearly etc.
- Only 2 activities currently in the db

## Some considerations

- On the first page of the dashboard, if the user does not have any activity inputs or they have rather increased their activities, they get a preset message encouraging them to log their activities. Otherwise, they get their dashboard statistics
- The starting data for the db is semi-random, but it can happen that they are actually increasing emissions. In that case the front page wouldn't show reductions

## Challenges and things learned

- Using Material UI and Tailwind together caused several issues with styles overriding each other and looking different between running in development and after building. Furthermore, Material UI is quite heavy on imports, which can potentially be an issue.
- Using TypeScript mixed with JSX proved to be challenging when building the project, so for the frontend, I mostly changed the files to JSX.
- Learning how Next.js and NestJS work were not big challenges, but it was very interesting to learn about monorepos and understand both the benefits of TypeScript and the NestJS framework.
- Understanding how the API works in TypeScript and NestJS was challenging but certainly a valuable experience in understanding the benefits of TypeScript and learning NestJS.
- Tests were something new to me, and I had the time and opportunity to implement some simple tests. However, more tests would have been a good addition to the codebase.

## Potential improvements

- Responsiveness could have been more worked on
- Units could have been more comprehensive and user friendly instead of using TJ
- Errors could be more uniform and errors coming from the database could be used directly on the frontend
- To increase safety we could have allowed only specific origin calls on the api
- Emission reductions method should send positive number to frontend

## Time Spent

The estimated time spent on this assignment is approximately 48 hours.

## Additional run method

The built monorepo can be run in parallel by running npm start -parallel
