pseudo="$2"
room="$1"

ee=$(curl -s "http://newyork.iut-clermont.uca.fr/b/$room" \
--data-raw "utf8=%E2%9C%93&authenticity_token=PAS_ENCORE_COMPRIS&%2Fb%2F$room%5Bsearch%5D=&%2Fb%2F$room%5Bcolumn%5D=&%2Fb%2F$room%5Bdirection%5D=&%2Fb%2F$room%5Bjoin_name%5D=$pseudo")

ee=$(echo $ee | grep -Po '(?<=").*?(?=")' | sed "s/&amp;/\&/g")

ee=$(curl -Lv --stderr - $ee | grep -Po '(?<=Location: ).*?(?=$)')

ee=$(echo $ee | sed "s/\r//g" | grep -Po '(?<=\?).*?(?=$)')

session_token=$(echo $ee | grep -Po '(?<==)(.*)')

enter=$(curl -s https://newyork.iut-clermont.uca.fr/bigbluebutton/api/enter?sessionToken=$session_token)

meetingID=$(echo $enter | jq .response.meetingID | sed "s/\"//g")
internalUserID=$(echo $enter | jq .response.internalUserID | sed "s/\"//g")
authToken=$(echo $enter | jq .response.authToken | sed "s/\"//g")
externUserID=$(echo $enter | jq .response.externUserID | sed "s/\"//g")

node join.js $meetingID $internalUserID $authToken $externUserID &

echo "Joining session as $pseudo"