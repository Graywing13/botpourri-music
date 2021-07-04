# Music Bot. 

## User stories
- I want to be able to add one alias to each show
  - If my alias is already in use, I want the bot to tell me which show i’m conflicting with
- I want to have the option of waiting until the 20s is up OR have the bot autoskip once I get the song right. 
  - vote skip by typing b.vs
    - I want to be able to have the bot send me a vote skip confirmation which includes the answer i put, and a :checkmark: to react. 
- I want to be able to make amq playable albums with songs
  - Ability to add all songs from a certain show into an album
- Be able to see how many times i’ve played a song (both learning and playing modes), my correctness rate, the aliases and notes I’ve added for it. 
- Be able to tag songs, and only play songs from tag. 
- add last man standing mode 


## TODO list:
Next up <br>
- make bot be able to pick range of song difficulty
- migrate all tags to personal 
- figure out how i want to store the "luministhecat" "xanathar" etc tags. 
- host bot on aws  

High priority (Done: 3) <br>
- factor tags out to personal profile

Medium priority (Done: 4) <br>
- add a regex and feature for specifying both start and stop sample point
- finish sendCommandUsageInfo
- mutex for the tag songs; acquire mutex and try to write to songs.js
- bot thinks it can "play" invalid files which are 0-second songs.  

Low priority (Done: 1) <br>
- check whether i can access internal files from an external source (thats bad)
- b.giverole is scuffed.  
- bot automatic help page & command descriptions  
- would be nice to mutex lock serverQueue especially in play.js  
- ytld-core  

Another Project (Done: 2) <br>
- pseudo-dropdown: be able to find a list of strings that are similar to the string being typed  
- read google sheets cells  
