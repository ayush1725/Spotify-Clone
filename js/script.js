//Ayush Dwibedy.
let currentSong = new Audio();
let songs;
let currfolder;

//To show Remaining Time and current Time of the song
function secondsToMinutesAndSeconds(seconds) {
    if(isNaN(seconds)||seconds<0){
        return "00:00" ;
    }
    // Calculate minutes and remaining seconds
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);

    // Format the output with leading zeros
    var formattedMinutes = String(minutes).padStart(2, '0');
    var formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Combine minutes and seconds with a colon
    var formattedTime = formattedMinutes + ":" + formattedSeconds;

    return formattedTime;
}

async function getSongs(folder) {
    currfolder=folder;
    let a = await fetch(`${folder}/`)
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    

    //shows all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML="  "
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> <img class="invert" src="img/music.svg" alt="">
        <div class="info">
        <div> ${song.replaceAll("%20", " ")}</div>
        <div>Ayush</div>
    </div>
    <div class="playnow">
        <span>Play Now</span>
        <img class="invert" src="img/play.svg" alt="">
    </div>
 </li>`;

    }
    //attach a eventlistner to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    return songs //plays the first songs of the playlist
    

}
const playMusic = (track,pause=false) => {
    // let audio=new Audio("/songs/"+track)
    currentSong.src = `/${currfolder}/` + track
    if(!pause){
        currentSong.play()
        play.src = "img/pause.svg"
    }
    
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
    //show all the songs in the playlist
    
}
async function displayAlbums(){
    let a = await fetch(`http://127.0.0.1:5500/songs`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors=div.getElementsByTagName("a")
    let cardcontainer=document.querySelector(".cardcontainer")
    let array=Array.from(anchors)
    anchors.forEach(async e=>{
        if( e.href.includes("/songs") && !e.href.includes(".htaccess")){
            //get name of the folder
            let folder = e.href.split("/").slice(-2)[0]
            // Get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json();
            console.log(response)
            cardcontainer.innerHTML=cardcontainer.innerHTML+ `
            <div data-folder="Devotional" class="card ">
            <div class="play">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
                    <!-- Circular background -->
                    <circle cx="24" cy="24" r="24" fill="#00FF00" />

                    <!-- Original SVG path with black stroke -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" x="14" y="11"
                        viewBox="0 0 24 24" fill="#000">
                        <path d="M5 20V4L19 12L5 20Z" stroke="#000000" stroke-width="1.5"
                            stroke-linejoin="round" />
                    </svg>
                </svg>

            </div>
            <img src="/songs/${folder}/cover.jpg" alt="">
                        <h3>${response.title}</h3>
                        <p>${response.description} </p>
                    </div>`
        }
    })
}
async function main() {


    //list of songs
    await getSongs("songs/Bollywood");
    playMusic(songs[0],true)
   // console.log(songs)
   
   //display all albums on page

    
    //attach an eventlistner to play,next and previous 
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            console.log("Playing Now!!")
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })
    //time update
        currentSong.addEventListener("timeupdate", () => {
       // console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesAndSeconds(currentSong.currentTime)}:${secondsToMinutesAndSeconds(currentSong.duration)}`
        //seekbar sync
        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100 +"%"
    })
    //seekbar event listner
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100 ;
       document.querySelector(".circle").style.left=percent + "%" ;
        //offsetx shows the position nd .target shows the targeted tag/element
        //.getbounding shows the exact location in the pge
        currentSong.currentTime=((currentSong.duration)*percent)/100;
        //to sync music with seekbar control -(to update duration with seekbar)
    })
    //event listener for hamnburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left=0;
    })
    //event listener for hamnburger close button
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-120%";
    })
    //event listener for prev
    previous.addEventListener("click",()=>{
        currentSong.pause()
        console.log("Previous Clicked")
        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index-1)>=0){
            playMusic(songs[index-1])
        }

    })
    //event listener for next button
    next.addEventListener("click",()=>{
        currentSong.pause()
        console.log("Next Clicked")
        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index+1)<songs.length){
            playMusic(songs[index+1])
        }
        
    })
    //add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log("Setting Volume to",e.target.value,"/100")
        currentSong.volume=parseInt(e.target.value)/100
    })
    //add eventlistner to mute thr track
       document.querySelector(".volume>img").addEventListener("click",(e)=>{
        console.log(e.target)
        if(e.target.src.includes("img/volume.svg")){
            e.target.src=e.target.src.replace("img/volume.svg","img/Mute.svg")
            currentSong.volume=0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0
        }
        else{
            e.target.src= e.target.src.replace("img/Mute.svg","img/volume.svg")
            currentSong.volume=0.10;
            document.querySelector(".range").getElementsByTagName("input")[0]=20;
        }
       })
    //Load the playlist when the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        console.log(e)
        e.addEventListener("click",async item=>{
            console.log(item,item.currentTarget.dataset)
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0])
            
        })
    })

}
main()
/*
`currentSong.src`: This likely refers to the `src` property of the `currentSong` object. The `src` property often contains the source URL of an audio or video element.

 `currentSong.src.split("/")`: This splits the `src` URL using the "/" (forward slash) as a delimiter, creating an array of substrings.

`.slice(-1)`: This takes the last element of the array. In other words, it gets the substring after the last "/" in the `src` URL.

`[0]`: This accesses the first element of the array obtained from the `slice(-1)` operation. Since `slice(-1)` returns an array with a single element (the last part of the URL), `[0]` extracts that element.

`songs.indexOf(...)`: This uses the `indexOf` method on the `songs` array to find the index of the element obtained from the previous steps within the `songs` array. If the element is not found, it returns -1.

*/
