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
- implement queue  
- implement Now Playing  
- read google sheets cells  

High priority <br>
- queue
- now playing function  

Medium priority <br>
- hash out msg.member.voice.channel
- bot thinks it can "play" invalid files which are 0-second songs.  
- sonarlint security hotspot handler, look into. 
- ytld-core
- host bot on aws  

Low priority <br>
- b.giverole is scuffed.  
- bot automatic help page & command descriptions  
- check against bad command usage (e.g. users improperly inputting command args in discord)  
