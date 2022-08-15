#!/bin/bash

# https://dash.teams.cloudflare.com/fd0de1717d803930d25204cfe89145f6/access/tunnels/
# https://dash.cloudflare.com/fd0de1717d803930d25204cfe89145f6/elenoid.uk/rules
# https://tiktok-sharer.herokuapp.com

heroku container:login
heroku container:push web --app=tiktok-sharer
heroku container:release web --app=tiktok-sharer
heroku ps:scale web=1 --app=tiktok-sharer
heroku open --app=tiktok-sharer
