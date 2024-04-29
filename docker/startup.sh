#!/bin/bash

if ! [ -d /usr/local/bin/dist ];then
	ln -s /mnt/src/dist /usr/local/bin/dist
fi

/usr/local/bin/api-man-front-v4.1 /mnt/src/conf.json
