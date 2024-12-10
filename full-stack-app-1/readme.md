# Rent a Cat
A full stack app for practice and sport.


## Static content

The static folder is actually populated by running `npm run build` in the `/frontend` folder.

## Frontend

Is a React app setup and built using vite.

I have set it up so that api requests during developement are proxied to the Backend server.

## Backend

Is an Express app that is dependendent on PostgrsQl.  The current database credentials are:
```
  database: 'postgres',
  username: 'posrgres', // note the spelling mistake
  password: '',
  host: '127.0.0.1',
  port: 5432,
```
