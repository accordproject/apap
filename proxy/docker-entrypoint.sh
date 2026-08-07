#!/bin/sh
set -e
htpasswd -bc /etc/nginx/.htpasswd "${NGINX_AUTH_USER}" "${NGINX_AUTH_PASSWORD}"
RESOLVER=$(awk '/^nameserver/{print $2; exit}' /etc/resolv.conf)
sed -i "s/RESOLVER_PLACEHOLDER/$RESOLVER/" /etc/nginx/nginx.conf
exec nginx -g 'daemon off;'
