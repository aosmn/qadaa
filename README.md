# Setup for development

Rename `.env.example` to `.env` and fill in the variables (values in Heroku)

Run `npm i` in client directory and in the root directory

Run `npm run dev` in the root directory to startup the client and server

# Deployment

To deploy to heroku
- Run `heroku git:remote -a qadaa`
- Run `git push heroku main`