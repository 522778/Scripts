#!/bin/zsh

# start
echo "This is .CUE file creator"
echo "Make sure your music is located like this"
echo "'.../band_name/year - album_name/music_files'"
echo "ex. '.../Metallica/1986 - Master Of Puppets/tracks'"
echo "and this script is inside the folder with the tracks"

# set variables

echo "Enter the genre:"
read GENRE
GENRE="${GENRE^}"
FULL_PATH=$(find "$PWD" | head -1)
COUNT_SUBDIR=$(echo $FULL_PATH | grep -o "/" | wc -l)
CURRENT_DIR=$(echo $FULL_PATH | cut -d "/" -f $((COUNT_SUBDIR + 1)))
PARENT_DIR=$(echo $FULL_PATH | cut -d "/" -f $COUNT_SUBDIR)
PERFORMER=$PARENT_DIR
TITLE=$(echo $CURRENT_DIR | cut -d " " -f 3-)
DATE=$(echo $CURRENT_DIR | cut -d " " -f 1)

# check is .cue file already exists

echo "Check existing .CUE files"

if [[ $(ls *.cue 2>/dev/null | wc -l) -gt 0 ]]; then
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