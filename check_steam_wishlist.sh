#!/bin/bash

# returns list of games with discount equal or more
# see 'expected params'
# profile wishlist should be public

# check script variables

if [ -n "$1" ]; then
	PROFILE_ID=$1
	DISCOUNT_EXPECTED=$2
else
	echo "Expected params:"
	echo "1. Profile 64 id, ex. 76561198024952213"
	echo "2. Expected discount, from 0 to 100"
	exit 1
fi

# functions

getAppIdsFromWishlist() {
	local API="https://api.steampowered.com/IWishlistService/GetWishlist/v1/?steamid="
	local REQUEST="${API}${PROFILE_ID}"
	local RESULT=$(curl -sl ${REQUEST} | grep -oP '"appid":\s*\K\d+' | paste -sd,)
	echo "$RESULT"
}

getAppIdDiscount() {
	local APP_ID_LIST=$1
	local API="https://store.steampowered.com/api/appdetails?appids="
	local REQUEST="${API}${APP_ID_LIST}&filters=price_overview"
	local RESULT=$(curl -sl "${REQUEST}" | tr '{},' '\n' | grep -P '(\"\d+\"|discount_percent)' | sed 's/\"\|://g' | sed ':a;N;$!ba;s/\ndiscount_percent/_/g')
	echo "$RESULT"
}

getAppUrl() {
	local APP_ID=$1
	echo "https://store.steampowered.com/app/${APP_ID}/"
}

# main

APP_IDS=$(getAppIdsFromWishlist)
APP_ID_DISCOUNT_LIST=$(getAppIdDiscount "$APP_IDS")

for APP_ID_DISCOUNT in $APP_ID_DISCOUNT_LIST; do
	if [[ "$APP_ID_DISCOUNT" =~ "_" ]]; then
		APP_ID=${APP_ID_DISCOUNT%_*}
		DISCOUNT=${APP_ID_DISCOUNT#*_}
		if [[ "$DISCOUNT" -ge "$DISCOUNT_EXPECTED" ]]; then
			APP_URL=$(getAppUrl "$APP_ID")
			echo "$APP_URL"
		fi
	fi
done