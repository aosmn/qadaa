# Setup for development

Rename `.env.example` to `.env` and fill in the variables (Request values from alaa.osmana@gmail.com)

Run `npm i` in client directory and in the root directory

Run `npm run dev` in the root directory to startup the client and server

# Deployment

We are currently using [Fly.io](https://fly.io/docs/) for hosting the application

To deploy the application:
- Login to Fly.io `fly auth login`
- Run the `deploy.sh` script.
- In order to add environment secrets to flyctl we use the following command
`flyctl secrets set CLIENT=https://qadaa.aosmn.com`

Fly.io uses docker for deployment. That is done using the autogenerated `Dockerfile`

## Debugging Deployment
- `fly doctor`
- If your network might be blocking UDP, you can run `flyctl wireguard websockets enable`
followed by `flyctl agent restart`, and we'll run WireGuard over HTTPS.
- `LOG_LEVEL=debug fly deploy`