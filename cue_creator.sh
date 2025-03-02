#!/bin/zsh

# start
echo "This is .CUE file creator"
echo "Make sure your music is located like this"
echo "'.../band_name/year - album_name/music_files'"
echo "ex. '.../Metallica/1986 - Master Of Puppets/tracks'"
echo "and this script is inside the folder with the tracks"

# set variables

FULL_PATH=$(find "$PWD" | head -1)
PARENT_DIR=${FULL_PATH##*/}
GRAND_PARENT_DIR=${FULL_PATH%/*}
GRAND_PARENT_DIR=${GRAND_PARENT_DIR##*/}
PERFORMER=$GRAND_PARENT_DIR
TITLE=${PARENT_DIR:7}
DATE=${PARENT_DIR::4}
echo "Enter the genre:"
read GENRE
GENRE="${GENRE^}"

# check is .cue file already exists

echo "Check existing .CUE files"

if [ $(ls *.cue 2>/dev/null | wc -l) -gt 0 ]; then
	echo "Listed files will be deleted:"
	ls *.cue -1
	ls *.cue | xargs -d '\n' rm
else
	echo "No .CUE files found"
fi

# create new CUE

CUE=""
CUE+="PERFORMER $PERFORMER\n"
CUE+="TITLE $TITLE\n"
CUE+="REM DATE $DATE\n"
CUE+="REM GENRE $GENRE\n"

MOST_USED_EXTENSION=$(ls -1 | awk -F. '{if (NF>1) print $NF}' | sort | uniq -c | sort -nr | head -n 1 | awk '{print $2}')
MUSIC_FILES="*.$MOST_USED_EXTENSION"

COUNTER=1
for FILE_NAME in $MUSIC_FILES; do
	SONG_NAME="${FILE_NAME/".$MOST_USED_EXTENSION"/""}"
	SONG_NUMBER=$(printf "%02d" $COUNTER)
	((COUNTER++))

	CUE+="FILE \"$FILE_NAME\" FLAC\n"
	CUE+="\tTRACK $SONG_NUMBER AUDIO\n"
	CUE+="\tTITLE \"$SONG_NAME\"\n"
	CUE+="\t\tINDEX 01 00:00:00\n"
done

# confirm CUE

printf "\n==========check CUE============\n"
printf "\n$CUE"
printf "\n===============================\n"

# save CUE to file

printf "$CUE" > "$TITLE.cue"
echo "File saved to [$TITLE.cue]"
read -p "Press enter to continue..."