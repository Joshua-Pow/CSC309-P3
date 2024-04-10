# How to setup and run our project
## Requirements
- Python 3.11+
- Node 18+

## Backend
- CD into the backend directory with `cd oneonone_api`
- Create an .env with the key `SECRET_KEY` and any random value (ie: `SECRET_KEY="abc123"`)
- Create a venv with `python -m venv .venv`
- Activate the venv
  - Mac: `source venv/bin/activate`
  - Windows: `.venv\Scripts\activate`
- Run `pip install -r requirements.txt` to install the required packages
- CD into the `OneOnOne` directory with `cd OneOnOne`
- Run `python manage.py makemigrations` to create the database schema
- Run `python manage.py migrate` to apply the schema to the database
- Run the backend server using `python manage.py runserver`

## Frontend
- CD into the frontend directory with `cd oneonone_frontend`
- Install the node packages with `npm install`
- Run the frontend server using `npm run dev`

# Information about the program
- Sometimes after being logged in for 24hours your refresh JWT will expire and you will need to re-login
- The screen may flicker and redirect you due to the access JWT refreshing occuring, this is normal
- The sql lite db is in the backend directory and is called `db.sqlite3`
  -It has be pre-populated with 10 users and 5 calendars
  -Each user has the respective login to their user number:
    - Username: user1
    - First name: user1first
    - Last name: user1last
    - Password: user1password
    - Email: user1@email.com
- All calendars have been created by user1
- You can see whos joined the calendar by clicking either the share link icon OR hovering the orange days to visualize whos uploaded their timeslots on that day
- All buttons on the calendar cards have tooltips to explain what they do
- The strength of the orange colors on the days signifies how many people have uploaded their timeslots
- A day with no orange fill, but only board indicates no timeslots have been uploaded for that day


