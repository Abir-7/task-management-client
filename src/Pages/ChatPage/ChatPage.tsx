import { useEffect, useState } from "react";

import { IoPersonAddOutline } from "react-icons/io5";
import { FaRegDotCircle } from "react-icons/fa";
import {
  useCreateConnectionMutation,
  useGetConnectionQuery,
  useGetUserChatQuery,
  useUpdateConnectionStatusMutation,
} from "../../Redux/feature/api/baseApi";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { FaUserCheck } from "react-icons/fa6";
import MessageBox from "./MessageBox";
import { MdFileDownloadDone } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { socket } from "../../socketio/socketio";

function ChatPage() {
  const [connectionID, setConnectionId] = useState("");

  const [selectedIndex, setSelectedIndex] = useState(0);

  const [receverPerson, setReceverPerson] = useState<{
    email: string;
    name: string;
  }>({ email: "", name: "" });

  const [receverSocketID, setReceverSocketID] = useState<{
    email: string;
    socketID: string;
  }>({ email: "", socketID: "" });

  const [senderSocketID, setSenderSocketID] = useState<{
    email: string;
    socketID: string;
  }>({ email: "", socketID: "" });

  const { email, allOnlineUser } = useSelector(
    (state: RootState) => state.userInfo
  );

  const [createConnection, { data: connectionReqData }] =
    useCreateConnectionMutation();

  const [ConnectionStatus,{
    data:pendingConnectionStatus
  }] = useUpdateConnectionStatusMutation();

  const { data } = useGetUserChatQuery(email, { skip: email ? false : true });
  const { data: getConnectionData, refetch: refetchConnectionData } =
    useGetConnectionQuery({ email }, { skip: !email });

console.log(pendingConnectionStatus,'pending status')
useEffect(()=>{
if(pendingConnectionStatus){
if(pendingConnectionStatus.requestedBy){
  socket.emit('connectionStatus',{msg:'reqAcpt',email:pendingConnectionStatus.requestedBy})
}
}},[pendingConnectionStatus])

  useEffect(() => {
    if (connectionReqData) {
      const reciver = connectionReqData.conncetionData.persons.filter(
        (p: { email: string; name: string }) =>
          p.email !== connectionReqData.conncetionData.requestedBy
      )[0];

      socket.emit("pendingReq", { msg: "newReq", reciver: reciver });
    }
  }, [connectionReqData?.conncetionData]);

  useEffect(() => {
    socket.on("pendingReqs", (data) => {
      if (data=='newReq') {
        refetchConnectionData();
      }
    });
    socket.on("connection_Status", (data) => {
      if (data=='reqAcpt') {
        refetchConnectionData();
      }
    });
    
  }, [socket]);

  const changeConnectionStatus = (id: string) => {
    ConnectionStatus({ id: id });
  };
  const showMsg = ({
    id,
    index,
    singleConnection,
    allOnlineUser,
    senderEmail,
  }: {
    id: string;
    index: number;
    singleConnection: [{ email: string; name: string }];
    allOnlineUser: { email: string; socketID: string }[];
    senderEmail: string;
  }) => {
    setSelectedIndex(index + 1);
    setConnectionId(id);

    const person = singleConnection?.filter((p) => p.email !== email)[0];

    const receverId = allOnlineUser.find((user) => user.email == person.email);
    if (receverId) {
      setReceverSocketID(receverId);
    }
    const senderId = allOnlineUser.find((user) => user.email == senderEmail);
    if (senderId) {
      setSenderSocketID(senderId);
    }
    setReceverPerson(person);
  };

  const openSlider = (number: number) => {
    const slider2 = document.getElementById("slide2") as HTMLElement;
    const slider1 = document.getElementById("slide1") as HTMLElement;
    if (number == 1) {
      console.log("hit", slider1);
      slider1.classList.add("active1");
      slider2.classList.remove("active2");
    }
    if (number == 2) {
      slider2.classList.add("active2");
      slider1.classList.remove("active1");
    }
    if (number == 3) {
      slider1.classList.remove("active1");
      slider2.classList.remove("active2");
    }
  };

  return (
    <div className="chat-container">
      <div id="slide1" className="chat-box cbox-1 ">
        <div>
          <div className="chat-title">
            <div onClick={() => openSlider(3)} className="cross2">
              <RxCross2 />
            </div>
            <div style={{ width: "100%" }}>
              <h3 style={{ textAlign: "center" }}>Pending Connection</h3>
            </div>
          </div>
          <hr />
          <div className="pending-connection">
            {getConnectionData?.getAllConnection?.allPendingConnection.length ==
              0 && <p style={{ textAlign: "center" }}>No Pending Request</p>}
            {getConnectionData?.getAllConnection?.allPendingConnection?.map(
              (singleConnection, index) => {
                return (
                  <div className="user-in-chat" key={index + 1}>
                    <div className="layer"></div>
                    <div className="chat-user-profile">
                      {singleConnection?.persons
                        ?.filter((p) => p.email !== email)
                        .map((p, index) => (
                          <img
                            key={index}
                            src={
                              p?.photoURL
                                ? p?.photoURL
                                : "https://img.freepik.com/free-photo/close-up-young-successful-man-smiling-camera-standing-casual-outfit-against-blue-background_1258-66609.jpg?w=1380&t=st=1704644431~exp=1704645031~hmac=7652214cef9b38ab9cf939c9bdbc9ab6951115f4d86a2cfb5211fc2b3e8243b2"
                            }
                            alt=""
                          />
                        ))}
                    </div>
                    <div className="chat-user-name">
                      {singleConnection?.persons
                        ?.filter((p) => p.email !== email)
                        .map((p, index) => (
                          <div key={index}>{p.name}</div>
                        ))}
                    </div>
                    <div className="accept-btn">
                      <p
                        onClick={() =>
                          changeConnectionStatus(singleConnection._id)
                        }
                      >
                        {" "}
                        <FaUserCheck></FaUserCheck>
                      </p>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
        <div>
          <div style={{ width: "100%" }} className="chat-title">
            <h3 style={{ textAlign: "center" }}>Your Connections</h3>
          </div>
          <hr />
          <div className="allFriends">
            {getConnectionData?.getAllConnection?.allAcceptedConnection?.map(
              (singleConnection, index) => {
                return (
                  <div
                    onClick={() =>
                      showMsg({
                        id: singleConnection._id,
                        index: index,
                        singleConnection: singleConnection.persons,
                        allOnlineUser,
                        senderEmail: email,
                      })
                    }
                    style={
                      index + 1 == selectedIndex
                        ? { backgroundColor: "#9f65fc", color: "#ffffff" }
                        : {}
                    }
                    className="user-in-chat"
                    key={index + 1}
                  >
                    <div className="layer"></div>
                    <div className="chat-user-profile">
                      {singleConnection?.persons
                        ?.filter((p) => p.email !== email)
                        .map((p, index) => (
                          <img
                            key={index}
                            src={
                              p?.photoURL
                                ? p?.photoURL
                                : "https://img.freepik.com/free-photo/close-up-young-successful-man-smiling-camera-standing-casual-outfit-against-blue-background_1258-66609.jpg?w=1380&t=st=1704644431~exp=1704645031~hmac=7652214cef9b38ab9cf939c9bdbc9ab6951115f4d86a2cfb5211fc2b3e8243b2"
                            }
                            alt=""
                          />
                        ))}
                    </div>
                    <div className="chat-user-name">
                      {singleConnection?.persons
                        ?.filter((p) => p.email !== email)
                        .map((p, index) => (
                          <div key={index} className="online-notification">
                            <div>
                              <p key={index}>{p.name} </p>
                            </div>
                            <div className="notify">
                              {allOnlineUser?.find((user) => {
                                if (user.email == p.email) {
                                  return true;
                                } else {
                                  return false;
                                }
                              }) ? (
                                <FaRegDotCircle />
                              ) : (
                                <></>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
      <div className="chat-box cbox-2">
        <MessageBox
          senderSocketID={senderSocketID}
          receverSocketID={receverSocketID}
          openSlider={openSlider}
          receverPerson={receverPerson}
          email={email}
          connectionID={connectionID}
        ></MessageBox>
      </div>

      <div id="slide2" className="chat-box cbox-3 ">
        <div className="chat-title">
          <div>
            <h3>All Users</h3>
          </div>
          <div onClick={() => openSlider(3)} className="cross">
            <RxCross2 />
          </div>
        </div>
        <hr />
        <div>
          {data?.withAdmin?.map((user, index) => {
            return (
              <div className="user-in-chat" key={index}>
                <div className="layer"></div>
                <div className="chat-user-profile">
                  <img
                    src={
                      user?.photoURL
                        ? user?.photoURL
                        : "https://img.freepik.com/free-photo/close-up-young-successful-man-smiling-camera-standing-casual-outfit-against-blue-background_1258-66609.jpg?w=1380&t=st=1704644431~exp=1704645031~hmac=7652214cef9b38ab9cf939c9bdbc9ab6951115f4d86a2cfb5211fc2b3e8243b2"
                    }
                    alt=""
                  />
                </div>
                <div className="chat-user-name">
                  {user.email == email ? "You" : user?.name}{" "}
                  {user.role == "admin" && <>({user.role})</>}
                </div>
                {user.email !== email &&
                  getConnectionData?.getAllConnection?.acceptedConnectionEmail.includes(
                    user.email
                  ) !== true && (
                    <div
                      onClick={() =>
                        createConnection({
                          email1: email,
                          email2: user.email,
                        })
                      }
                      className="send-req"
                    >
                      <IoPersonAddOutline />
                    </div>
                  )}
              </div>
            );
          })}
        </div>
        <div className="chat-title">
          <h3>Requested Users</h3>
        </div>
        <hr />
        <div>
          {data?.reqestedUser?.map((user, index) => {
            return (
              <div className="user-in-chat" key={index}>
                <div className="layer"></div>
                <div className="chat-user-profile">
                  <img
                    src={
                      user?.photoURL
                        ? user?.photoURL
                        : "https://img.freepik.com/free-photo/close-up-young-successful-man-smiling-camera-standing-casual-outfit-against-blue-background_1258-66609.jpg?w=1380&t=st=1704644431~exp=1704645031~hmac=7652214cef9b38ab9cf939c9bdbc9ab6951115f4d86a2cfb5211fc2b3e8243b2"
                    }
                    alt=""
                  />
                </div>
                <div className="chat-user-name">
                  {user?.name} {user.role == "admin" && <>({user.role})</>}
                </div>
                <div className="send-req" style={{ color: "green" }}>
                  <MdFileDownloadDone />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
