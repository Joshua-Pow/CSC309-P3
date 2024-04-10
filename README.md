# How to setup and run our project
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


