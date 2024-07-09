# Project Setup Guide

## Requirements
- Visual Studio Code (Not required but reccomended)
- Python
- pip 

## Clone the Repository
Clone this repository by downloading it directly or using VS Code:
[https://github.com/callan321/FutureFinance](https://github.com/callan321/FutureFinance)

## Install Packages
Open the terminal in VS Code and install the following packages:

```sh
pip install django djangorestframework
```

## Run the Server
Once the packages are downloaded, run the command:

```sh
python manage.py runserver
```
This should give you a link to [http://127.0.0.1:8000/](http://127.0.0.1:8000/), which is a local server. Opening the link will take you straight to the chat simulation, which is an extension of the original project.

## Access the Admin Page
Additionally, go to the link [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/) (there's no button, you have to type it manually). You can log into the admin page with the following credentials:
- **User:** admin
- **Password:** admin

Here, you can add additional users, look at the chat database, and see hidden items stored in the SQLite database (IV and timestamp). You can confirm that the actual message isn't stored in the database at all. You can also edit/delete users and messages.

