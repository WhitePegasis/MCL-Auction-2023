import React from "react";
import { useState, useEffect } from "react";
import {
  getPlayers,
  getTeams,
  editTeamPoints,
  editTeamPlayerList,
  editPlayer,
  addLogs,
} from "../api/api";
import { ThreeDots } from "react-loader-spinner";

const maxPoint = 2100;
const teamNames = ["RR", "CSK", "KKR", "DC", "RCB", "SRH", "GT"];

const AllEligiblePlayers = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const [playerIdx, setPlayerIdx] = useState(null);
  const [biddingStarted, setBiddingStarted] = useState(false);
  const [bidValue, setBidValue] = useState(0);
  const [bidderName, setBidderName] = useState("Unsold");
  const [newBidValue, setNewBidValue] = useState("");
  const [newBidderName, setNewBidderName] = useState("select");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedPlayerImage, setSelectedPlayerImage] = useState(null);

  const [showBidResultModal, setShowBidResultModal] = useState(false);
  const [bidResultMessage, setBidResultMessage] = useState("");

  function convertLink(link1) {
    // Extract the ID from the original link
    const match = link1.match(/id=([\w-]+)/);
    if (match) {
      const fileId = match[1];
      // Construct the new link using the extracted ID
      const link2 = `https://lh3.googleusercontent.com/d/${fileId}?authuser=0`;
      return link2;
    } else {
      return "Invalid link format";
    }
  }

  useEffect(() => {
    const updateOnlineStatus = () => {
      const onlineIcon = document.getElementById("onlineIcon");
      if (onlineIcon) {
        onlineIcon.style.color = navigator.onLine ? "white" : "red";
      }
    };

    window.addEventListener("offline", updateOnlineStatus);
    window.addEventListener("online", updateOnlineStatus);

    const fetchData = async () => {
      try {
        const playersResponse = await getPlayers("unsoldPlayers");
        setPlayers(playersResponse.data.data);
        console.log(playersResponse.data.data);

        const teamsResponse = await getTeams();
        setTeams(teamsResponse.data.data);
        console.log(teamsResponse.data.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Unable to fetch players or teams!");
      }
    };

    fetchData();

    return () => {
      window.removeEventListener("offline", updateOnlineStatus);
      window.removeEventListener("online", updateOnlineStatus);
    };
  }, []);

  const clickedStartBtn = () => {
    if (!window.navigator.onLine) {
      alert("Internet connection lost!");
    } else if (players.length === 0) {
      alert("No more players available.");
    } else if (window.confirm("Do you want to start the bidding?")) {
      const randomIndex = Math.floor(Math.random() * players.length);
      setPlayerIdx(randomIndex);
      setSelectedPlayer(players[randomIndex]);
      setBidValue(0);
      setBidderName("Unsold");
      setBiddingStarted(true);
      const link = convertLink(players[randomIndex].profilepic);
      console.log(link);

      setSelectedPlayerImage(link);
      console.log("Random index:", randomIndex);
    }
  };

  const resetPage = ()=>{
    setSelectedPlayer(null);
    setSelectedPlayerImage(null);
  }
  // on update button click
  //let bidderIndex=0;
  const bidButtonClick = () => {
    if (!biddingStarted) {
      alert("Start the bidding first!");
      return;
    }

    try {
      const newBidAmount = parseInt(newBidValue);
      const currIdx = parseInt(newBidderName);
      const tempBidderTeam = teams[currIdx];

      if (isNaN(newBidAmount)) {
        alert("Bid Value Field is empty!");
      } else if (currIdx === "select") {
        alert("Select a Bidder!");
      } else if (newBidAmount < bidValue) {
        alert("Current bid value is less than the previous bid!");
      } else if (newBidAmount > maxPoint - tempBidderTeam.pointsused) {
        alert(
          `Not enough points! Team only has ${
            maxPoint - tempBidderTeam.pointsused
          } points remaining.`
        );
      } else {
        setBidValue(newBidAmount);
        setBidderName(teamNames[currIdx]);
        setNewBidValue("");
        setNewBidderName("select");
      }
    } catch (error) {
      alert("Player data not loaded properly.");
      console.error("Error on bid update:", error);
    }
  }; // end of update button functionality

  // on rest button click
  const resetPointsBtnClick = () => {
    if (window.confirm("Are you sure you want to reset?")) {
      setBidValue(0);
      setBidderName("Unsold");
      setNewBidValue("");
      setNewBidderName("select");
    }
  }; //end reset button functionality

  const submitButtonClick = async () => {
    if (!biddingStarted) {
      alert("Start the bidding first!");
      return;
    }

    if (!window.navigator.onLine) {
      alert("Internet connection lost!");
      return;
    }

    if (window.confirm("Are you sure you want to submit?")) {
      const pointsUsed = bidValue;
      const playerDetails = {
        ...selectedPlayer,
        point: pointsUsed,
        soldto: bidderName,
      };

      try {
        setLoading(true);
        if (bidderName === "Unsold") {
          playerDetails.soldto = "unsold";
          await addLogs(playerDetails);
          await editPlayer(playerDetails);
          alert(`${playerDetails.name} remained unsold.`);
          window.location.reload();
        } else {
          const currTeam = teams.find((team) => team.name === bidderName);
          if (currTeam) {
            currTeam.pointsused += pointsUsed;
            await editTeamPoints(currTeam);
            await editTeamPlayerList(currTeam.name, playerDetails);
            await addLogs(playerDetails);
            await editPlayer(playerDetails);
            setBidResultMessage(
              `${playerDetails.name} got sold to ${currTeam.name} for ${pointsUsed} points.`
            );
            setShowBidResultModal(true);
          }
        }

        resetPage();
        resetPointsBtnClick();

      } catch (error) {
        alert("Submission failed. Please check your connection.");
        console.error("Error during submission:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="relative" style={{ backgroundColor: "rgb(205, 224, 231)" }}>
      {/*Navbar */}
      <nav
        className="mb-1 navbar navbar-expand "
        id="nav"
        style={{ backgroundColor: "rgb(63, 94, 197)", color: "white" }}
      >
        <div className="navbar-collapse" id="navbarSupportedContent-333">
          <ul className="navbar-nav mr-auto">
            <li
              className="nav-item active"
              style={{ backgroundColor: "rgb(63, 80, 190)" }}
            >
              <button
                className="nav-link"
                id="start"
                onClick={() => clickedStartBtn()}
                style={{
                  backgroundColor: "rgb(40, 68, 156)", // Initial button color
                  color: "white", // Text color
                  padding: "10px",
                  cursor: "pointer",
                  transition: "background-color 0.3s", // Add a smooth transition effect
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "rgb(59, 99, 227)")
                } // Change color on hover
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = "rgb(40, 68, 156)")
                }
              >
                Start Bidding
                {/* <span class="sr-only">(current)</span>  */}
              </button>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto nav-flex-icons">
            <li className="nav-item">
              <div
                className="nav-link "
                id="navbarDropdownMenuLink-333"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                style={{
                  cursor: "pointer",
                }}
              >
                <i className="fab fa-google-plus-g" id="onlineIcon"></i>
              </div>
            </li>
          </ul>
        </div>
      </nav>
      {/*/.Navbar */}

      {/* Modal */}
      {showBidResultModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          style={{ zIndex: 1000 }}
        >
          <div className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 rounded-xl shadow-2xl p-6 w-full max-w-lg transform transition-all scale-100 opacity-100 animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={() => setShowBidResultModal(false)}
              className="absolute top-2 right-3 text-white hover:text-gray-200 text-4xl"
            >
              &times;
            </button>

            {/* Modal Header */}
            <h2 className="text-3xl font-bold text-center text-white p-4">
              Bid Result
            </h2>

            {/* Modal Content */}
            <p className="text-xl text-center text-white p-4">
              {bidResultMessage}
            </p>

            {/* Button to Close */}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowBidResultModal(false)}
                className="bg-yellow-500 hover:bg-yellow-400 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      {/* Loader */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {loading && (
          <ThreeDots
            visible={true}
            height="80"
            width="80"
            color="#4fa94d"
            radius="9"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        )}
      </div>

      <div className="flex items-center justify-center w-full">
        <div className="flex justify-center space-x-5 mt-[40px]">
          {/* <div id="sold-div" style={{ display: 'none', padding: '100px' }}>
            <h2 id="sold-detail"><span id="sold-player-name">Player Name</span> sold to <span id="sold-player-team">teamname</span> by <span id="sold player bid">bid</span> points</h2>
            <button id="goto-next-bid">Go to Next Bid</button>
          </div> */}

          {/* Left Column */}
          <div className="w-full sm:w-[700px]" id="left-column">
            <div className="bg-white text-gray-700 w-full rounded-[2%] shadow-lg">
              <div className="w-full relative rounded-[2%]">
                <div className="h-[500px] overflow-auto rounded-[2%] no-scrollbar">
                  <img
                    className="object-cover w-full h-auto max-h-none max-w-none bg-no-repeat rounded-[2%]"
                    src={selectedPlayerImage || "default-player-image.jpg"}
                    alt="default-player-image.jpg"
                    onError={(event) => {
                      console.log("IMAGE ERROR");
                      // setSelectedPlayerImage(null);
                      event.onerror = null;
                    }}
                  />
                </div>
                <div className="absolute bottom-0 left-0 p-4 text-black bg-[rgba(215,232,250,0.771)] rounded-[2%]">
                  <h2 className="text-2xl">
                    {selectedPlayer?.name || "Player Name"}
                  </h2>
                </div>
              </div>

              <div className="p-3 mt-3 space-y-2">
                <h5 className="text-lg">
                  <i className="fa fa-briefcase fa-fw mr-2 text-xl" />
                  <b>Department: </b>
                  <span>{selectedPlayer?.dept || "XYZ"}</span>
                </h5>
                <h5 className="text-lg">
                  <i className="fa fa-home fa-fw mr-2 text-xl" />
                  <b>Year: </b>
                  <span>{selectedPlayer?.year || "000"}</span>
                </h5>
                <hr className="my-3 h-[3px] bg-[#fff312]" />

                <div id="skill-div">
                  <b>
                    <p className="flex items-center justify-center text-white bg-[#3f5ec5] text-lg px-4 py-2">
                      {selectedPlayer?.speciality || "Speciality"}
                    </p>
                  </b>
                </div>
                <div className="bg-[#3f5ec5] text-white">
                  <b>
                    <p className="mt-3 flex items-center justify-center text-lg px-4 py-2">
                      Wicket Keeper: <span>{selectedPlayer?.wk || "No"}</span>
                    </p>
                  </b>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-2/3" id="right-column">
            <div className="p-4 shadow-md mb-4 rounded-[2%] bg-white">
              <b className="flex items-center flex-row justify-center bg-[rgba(215,232,250,0.771)] mt-4 rounded-[2%]">
                <h2
                  className="p-4 text-5xl font-cursive"
                  id="player-name2"
                  style={{ fontFamily: "Signika Negative" }}
                >
                  <i className="fa fa-user fa-fw mr-4 text-4xl" />
                  Player Name
                </h2>
              </b>
              <hr className="my-3 h-[3px] bg-[#fff312]" />
              <div>
                <h3
                  className="opacity-75 font-cursive text-2xl"
                  style={{ fontFamily: "Nunito" }}
                >
                  <b>CURRENT BID</b>
                </h3>
                <h1 className="m-[20px] text-4xl">
                  <i className="fa fa-calendar fa-fw mr-4" />
                  <span className="p-1 rounded-md bg-[#040815] text-white">
                    {bidValue || "0000"}
                  </span>
                </h1>
                <hr className="my-3 h-[3px] bg-[#fff312]" />
              </div>
              <div>
                <h3
                  className="opacity-75 font-cursive text-2xl"
                  style={{ fontFamily: "Nunito" }}
                >
                  <b>BIDDING TEAM</b>
                </h3>
                <h1 className="m-[20px] text-4xl">
                  <i className="fa fa-calendar fa-fw mr-4" />
                  <b>
                    <span id="bidder-name">{bidderName || "Unsold"}</span>
                  </b>
                </h1>
                <hr className="my-3 h-[3px] bg-[#fff312]" />
              </div>
              <div className="m-[20px] flex items-center justify-center">
                <div className="flex items-center">
                  <input
                    className="mr-3 border rounded p-1 "
                    id="new-bid-value"
                    type="number"
                    placeholder="Bid Amount"
                    aria-label="New Bid"
                    style={{ width: "20%" }}
                    value={newBidValue}
                    onChange={(e) => setNewBidValue(e.target.value)}
                  />
                  <select
                    name="languages"
                    style={{ padding: "8px" }}
                    value={newBidderName}
                    onChange={(e) => setNewBidderName(e.target.value)}
                    className="border border-b-2"
                  >
                    <option value="select">Select Bidder Name</option>
                    {teams.map((team, index) => (
                      <option key={team.name} value={index}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={bidButtonClick}
                    className="px-4 py-2 border-2 border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white transition-colors duration-300 ml-5"
                    style={{
                      padding: "10px",
                      paddingLeft: "20px",
                      paddingRight: "20px",
                    }}
                  >
                    Update
                  </button>
                </div>
              </div>
              <div className="m-[10px] flex align-bottom justify-end">
                <img
                  src="reset.png"
                  onClick={resetPointsBtnClick}
                  alt="Avatar"
                  id="reset"
                  height={40}
                  width={40}
                  style={{ cursor: "pointer" }}
                  contextMenu="Reset"
                />
              </div>
            </div>
            <div className="w-2/3 p-2">
              <button
                onClick={() => {
                  window.open(`${players[playerIdx].profilepic}`, "_blank");
                }}
                className="px-4 py-2 bg-green-900 text-white rounded shadow-lg shadow-black hover:bg-green-600 border-none"
              >
                View Image
              </button>
            </div>

            <div className="w-2/3 mt-2 p-2">
              <button
                onClick={submitButtonClick}
                className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-600 border-none outline-none"
              >
                <i
                  className="fa fa-spinner fa-spin"
                  id="loadingIcon"
                  style={{ display: "none" }}
                ></i>{" "}
                Submit
              </button>
            </div>

            {/* End Right Column */}
          </div>
        </div>
      </div>

      <footer
        className="p-4 text-center mt-4"
        id="footer"
        style={{ backgroundColor: "rgb(63, 94, 197)" }}
      >
        <p>MEGHNAD SAHA CRICKET LEAGUE</p>
        <p>
          Powered by{" "}
          <a
            href="https://www.instagram.com/mcl_msit/"
            target="_blank"
            className="text-[#3ffcF2]"
            rel="noreferrer"
          >
            MCL
          </a>
        </p>
      </footer>
    </div>
  );
};

export default AllEligiblePlayers;
