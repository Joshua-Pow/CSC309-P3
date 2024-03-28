#!/bin/bash

#Need to allow ./run.sh to be executable
chmod +x run.sh

# Update system package index
sudo apt-get update

# Install Python3 and pip if they are not installed
sudo apt-get install -y python3 python3-pip

# Install virtualenv if not already installed
pip3 install virtualenv

# Create a virtual environment named 'venv' in the current directory
virtualenv -p python3 venv

# Activate the virtual environment
source venv/bin/activate

# Install required Python packages from requirements.txt
pip install -r ./requirements.txt

# Install system packages required by some Python packages (e.g., Pillow)
sudo apt-get install -y libjpeg-dev zlib1g-dev

# Navigate to the Django project directory
cd ./OneOnOne

# Make migrations for all Django apps
python ./manage.py makemigrations Calendars
python ./manage.py makemigrations Contacts
python ./manage.py makemigrations Invitations
python ./manage.py makemigrations TimeSlots

# Run Django migrations
python ./manage.py migrate

# Deactivate the virtual environment
deactivate