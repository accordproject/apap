#!/bin/sh
set -e
htpasswd -bc /etc/nginx/.htpasswd "${NGINX_AUTH_USER}" "${NGINX_AUTH_PASSWORD}"
exec nginx -g 'daemon off;'
