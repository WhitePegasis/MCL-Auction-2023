import React from 'react';
import { useState, useEffect } from 'react';
import { getPlayers, getTeams, editTeamPoints, editTeamPlayerList ,editPlayer, addLogs} from '../api/api';

const maxPoint = 2100;
const teamNames=["RR","CSK","KKR","DC","RCB","SRH","GT"];


const AllEligiblePlayers = () => {

  window.addEventListener("offline", function() {
    this.document.getElementById('onlineIcon').style.color='red';
  });
  window.addEventListener("online", function() {
    this.document.getElementById('onlineIcon').style.color='white';
  });

  // if(!window.navigator.onLine){
  //   alert('Abe internet chala gya!');
  // }

    let playerIdx=0;
    let teamIdx = -1;
    let biddingStarted = false;

    const [players, setPlayers] = useState([]);
    const [teams, setTeams] = useState([]);
    
    useEffect(() => {
        getAllPlayers();
        getAllTeams();
    }, []);

    const getAllPlayers = async () => {
        try {
          
          await getPlayers("unsoldPlayers").then((response)=>{
            setPlayers(response.data.data);
            console.log(response.data.data);
          });

        } catch (error) {
            console.log("getAllPlayers error: ", error);
        }
    }

    const getAllTeams = async () =>{
      try {
          
        await getTeams().then((response)=>{
          setTeams(response.data.data);
          console.log(response.data.data);
        });

      } catch (error) {
          console.log("getAllPlayers error: ", error);
      }
    }

    const clickedStartBtn = ()=>{

        const playersCount = players.length;
        
        if(!window.navigator.onLine){
          alert('Abe internet chala gya!');
        }
        else if(playersCount === 0){
          alert("No more players");
        }
        else if(window.confirm('Do you want to start the bidding?')){

          playerIdx = Math.floor(Math.random() * playersCount); // generating random index 

          console.log('Total players count : ', playersCount );
          console.log('Random index: ', playerIdx);
          const name = document.querySelectorAll('#player-name1')[0];
          const name2=document.getElementById("player-name2");
          const year = document.querySelectorAll('#year')[0];
          const dept = document.querySelectorAll('#dept')[0];
          const speciality = document.querySelectorAll('#speciality')[0];
          const wk = document.querySelectorAll('#wk')[0];
          const playerImage = document.getElementById('player-image');

          name.innerHTML = `${players[playerIdx].name}`;
          name2.innerHTML = `${players[playerIdx].name}`;
          year.innerHTML = `${players[playerIdx].year}`;
          dept.innerHTML = `${players[playerIdx].dept}`;
          speciality.innerHTML = `${players[playerIdx].speciality}`;
          wk.innerHTML = `${players[playerIdx].wk}`;
          playerImage.src= `${players[playerIdx].profilepic}`;
          //console.log("Image url: "+players[playerIdx].profilePic);

          biddingStarted = true;
        }
    }




        const bidValue=document.getElementById("bid-value");
        const bidderName=document.getElementById("bidder-name");
        const newBidValue=document.getElementById("new-bid-value");
        const newBidderName=document.getElementById("new-bidder-name");
        const loadingIcon = document.getElementById("loadingIcon");

        // on update button click
        //let bidderIndex=0;
        const bidButtonClick= ()=>{

          try {
            const newBidVal=newBidValue.value;
            const currIdx=parseInt(newBidderName.value);
            const tempBidderTeam = teams[currIdx];
            const bidder=teamNames[currIdx];

            const remainingPoint = maxPoint - parseInt(tempBidderTeam.pointsused);
            const newPoint = parseInt(tempBidderTeam.pointsused) + parseInt(newBidVal);

            if(newBidVal===''){
              alert('Bid Value Field Empty!')
            }
            else if(bidder==='select'){
              alert('Select the Bidder!')
            }
            else if(parseInt(newBidVal) < parseInt(bidValue.innerText)){ 
              alert("current bid value less than previous bid!"); 
            } 
            else if(newPoint > maxPoint){
              alert("Not enough point!, Team only has "+ remainingPoint + " point remaining.");
            }
            else{
              bidValue.innerHTML=newBidVal;
              bidderName.innerHTML=bidder;
              newBidValue.value="";
              newBidderName.value="select";
              teamIdx = currIdx;
            }
          } catch (error) {
            
            alert('Player Data not fetched yet');
            console.log('Error on update button click: ',error);

          }
      } // end of update button functionality

      // on rest button click
      const resetBtnClick = ()=>{
        if(window.confirm("Are you sure you want to reset?")){
          bidValue.innerHTML="0000";
          bidderName.innerHTML="Unsold";
          newBidValue.value="";
          newBidderName.value="select";
        }
      } //end reset button functionality


      const submitButtonClick = async ()=>{

        if(!window.navigator.onLine){
          alert('Abe internet chala gya!');
        }
        else if(!biddingStarted){
          alert("Click on the start-bidding button to start the bidding!");
        }
        // else if(teamIdx < 0){
        //   alert("Cant submit the bidding data!");
        // }
        else if(window.confirm("Are you sure you want to submit?")){

          loadingIcon.style.display = 'block';

          let newPlayervalue = {
            name: '',
            dept: '',
            year: '',
            speciality: '',
            wk: '',
            registered: '',
            soldto: ''
          }

          const soldPlayerDetails = {
            name: '',
            dept: '',
            year: '',
            speciality: '',
            wk: '',
            point: 0,
            contact:'',
            email:'',
          }

          const pointsUsed = parseInt(bidValue.innerHTML);
          soldPlayerDetails.id = players[playerIdx].id;
          soldPlayerDetails.name = players[playerIdx].name;
          soldPlayerDetails.dept = players[playerIdx].dept;
          soldPlayerDetails.year = players[playerIdx].year;
          soldPlayerDetails.speciality = players[playerIdx].speciality;
          soldPlayerDetails.wk = players[playerIdx].wk;
          soldPlayerDetails.point = parseInt(pointsUsed);
          soldPlayerDetails.contact = players[playerIdx].contact;
          soldPlayerDetails.email = players[playerIdx].email;

          if(bidderName.innerText === 'Unsold'){

            newPlayervalue = soldPlayerDetails;
              newPlayervalue.soldto = 'unsold';
  
              await addLogs(newPlayervalue).then((res)=>{
                console.log("logs updated!");
             });
  
             await editPlayer(newPlayervalue).then((res)=>{
              console.log("Player Sold: ", newPlayervalue);
             });
              
              alert(newPlayervalue.name + " unsold :(");
              window.location.reload(false);

          }
          else{

            try {
            
              const newTeamValue = {
                name: '',
                pointsused: 0,
              }
              
              
              newTeamValue.name= teams[teamIdx].name;
              newTeamValue.pointsused=teams[teamIdx].pointsused + pointsUsed;
  
              
              
              await editTeamPoints(newTeamValue).then((res)=>{
                console.log("Team updated: ", newTeamValue);
              });
  
              await editTeamPlayerList(newTeamValue.name, soldPlayerDetails).then((res)=>{
                console.log(newTeamValue.name," playerlist updated: ", soldPlayerDetails);
              });
  
  
              newPlayervalue = soldPlayerDetails;
              newPlayervalue.soldto = newTeamValue.name;
  
              await addLogs(newPlayervalue).then((res)=>{
                console.log("logs updated!");
             });
  
             await editPlayer(newPlayervalue).then((res)=>{
              console.log("Player Sold: ", newPlayervalue);
             });
              
              alert(newPlayervalue.name + " got sold to "+ newTeamValue.name+ " for "+ pointsUsed);
  
              window.location.reload(false);
  
            } catch (error) {
              loadingIcon.style.display = 'none';
  
              alert("Unable to submit, Abe internet chala gya!")
              console.log("Error in submitButtonClick: ",error);
            }

          }

          
        }
      }

    return (

        <div style={{backgroundColor:'rgb(205, 224, 231)'}}>


            {/*Navbar */}
              <nav className="mb-1 navbar navbar-expand " id="nav" style={{backgroundColor:'rgb(63, 94, 197)', color:'white'}}>
                
                <div className="collapse navbar-collapse" id="navbarSupportedContent-333">
                  <ul className="navbar-nav mr-auto">
                    <li className="nav-item active" style={{backgroundColor:'rgb(63, 80, 190)'}}>
                      <a className="nav-link" href="#" id="start" onClick={() => clickedStartBtn()} style={{color:'white'}}>Start Bidding
                        {/* <span class="sr-only">(current)</span>  */}
                      </a>
                    </li>
                  </ul>
                  <ul className="navbar-nav ml-auto nav-flex-icons">
                    <li className="nav-item">
                      <a className="nav-link " id="navbarDropdownMenuLink-333" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i className="fab fa-google-plus-g" id='onlineIcon'></i>
                      </a>
                    </li>
                  </ul>
                </div> 
              </nav>
              {/*/.Navbar */}


            <div className="w3-content w3-margin-top" style={{maxWidth: '1400px'}}>
              <div className="w3-row-padding" id="parent-div" style={{marginTop: '40px'}}>
                <div id="sold-div" style={{display: 'none', padding: '100px'}}>
                  <h2 id="sold-detail"><span id="sold-player-name">Player Name</span> sold to <span id="sold-player-team">teamname</span> by <span id="sold player bid">bid</span> points</h2> 
                  <button id="goto-next-bid">Go to Next Bid</button>
                </div>

                {/* Left Column */}
                <div className="w3-third" id="left-column" style={{width: '700px'}}>
                  <div className="w3-white w3-text-grey w3-card-4" id="left-column-1">
                    <div className="w3-display-container" id='img-container'>
                      <img className="center-cropped" src="default-player-image.jpg" style={{width: '100%', height: '500px'}} alt="Avatar" id="player-image"/>
                      <div className="w3-display-bottomleft w3-container w3-text-black">
                        {/* <h2 style={{color: 'aliceblue'}} id="player-name1">Player Name</h2> */}
                        <h2 id="player-name1">Player Name</h2>
                      </div>
                    </div>
                    <div className="w3-container mt-3">
                      <h5><i className="fa fa-briefcase fa-fw w3-margin-right w3-large" /><b>Department: </b><span id="dept">XYZ</span></h5>
                      <h5><i className="fa fa-home fa-fw w3-margin-right w3-large" />
                        <b>Year: </b><span id="year">000</span></h5>
                      <hr />
                      {/* <p className="w3-large"><b><i className="fa fa-asterisk fa-fw w3-margin-right" />Skills</b></p> */}
                      <div id="skill-div">
                        <b><p className="skills " id="speciality"> Speciality </p></b>
                      </div>
                      <div id="skill-wk">
                        <b><p className="mt-3 skills">Wicket Keeper: <span id='wk'></span></p></b>
                      </div>
                      <br />
                    </div>
                  </div><br />
                  {/* End Left Column */}
                  </div>

                  {/* Right Column */}
                      <div className="w3-twothird" id="right-column">
                      <div className="w3-container w3-card w3-margin-bottom" id='right-column-1'>
                      <b id='right-column-player-name'>
                          <h2 className=" w3-padding-16 " id="player-name2" style={{fontFamily: 'Signika Negative'}}>
                          <i className="fa fa-user fa-fw w3-margin-right w3-xxlarge" />
                          Player Name</h2>
                      </b>
                      <hr />
                      <div className="w3-container">
                          <h3 className="w3-opacity currentBidHeader" style={{fontFamily: 'Nunito'}}><b>CURRENT BID</b></h3>
                          <h1 className="bid-display" ><i className="fa fa-calendar fa-fw w3-margin-right" />
                          <span className="w3-tag w3-round " id="bid-value">0000</span></h1> 
                          <hr />
                      </div>
                      <div className="w3-container">
                          <h3 className="w3-opacity currentBidHeader" style={{fontFamily: 'Nunito'}}><b>BIDDING TEAM</b></h3>
                          <h1 className=" bid-display"><i className="fa fa-calendar fa-fw w3-margin-right" />
                          <b><span id="bidder-name">Unsold</span></b></h1>
                          <hr />
                      </div>
                      <div className="newbid-container">
                          <div className="newbid-div">
                          <input className="new-bid mr-3" id="new-bid-value" type="number" placeholder="Bid Amount" aria-label="New Bid" style={{width: '20%'}} />
                          <select name="languages" id="new-bidder-name" style={{padding: '8px'}}>
                              <option value="select">Select Bidder Name</option>
                              <option value={0}>RR</option>
                              <option value={1}>CSK</option>
                              <option value={2}>KKR</option>
                              <option value={3}>DC</option>
                              <option value={4}>RCB</option>
                              <option value={5}>SRH</option>
                              <option value={6}>GT</option>
                          </select>
                          <button id="bid-button" onClick={bidButtonClick} className="btn btn-outline-primary ml-5" type="button" data-mdb-ripple-color="dark" style={{padding: '10px', paddingLeft: '20px', paddingRight: '20px'}}>
                              Update
                          </button>
                          </div>
                      </div>
                      <div className="reset-container">
                          <img src="reset.png" onClick={resetBtnClick} alt="Avatar" id="reset" height={40} width={40} style={{cursor: 'pointer'}} contextMenu="Reset" />
                      </div>
                      </div>
                      <div className="w3-twothird">
                      <button id="submit" onClick={submitButtonClick} type="button" className="btn btn-rounded" style={{backgroundColor:'rgb(81, 9, 182)', color:'white'}}><i className="fa fa-spinner fa-spin" id='loadingIcon' style={{display:'none'}}></i> Submit</button>
                      </div>
                      {/* End Right Column */}
                  </div>
                </div>
        </div>

        <footer className="w3-container w3-center w3-margin-top" id="footer" style={{backgroundColor:'rgb(63, 94, 197)'}}>
            <p>MEGHNAD SAHA CRICKET LEAGUE</p>
            <p>Powered by <a href="https://www.instagram.com/mcl_msit/" target="_blank" id="footer-link" rel="noreferrer" >MCL</a></p>
      </footer>
        </div>
      );
}

export default AllEligiblePlayers;