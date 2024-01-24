import { useEffect, useState } from "react";
import { socket } from "../../socketio/socketio";
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
import { RiMenuFoldFill, RiMenuUnfoldFill } from "react-icons/ri";
import { MdFileDownloadDone } from "react-icons/md";
function ChatPage() {
  const [isSkip, setIsSkip] = useState(true);
  const { email } = useSelector((state: RootState) => state.userInfo);

  const {
    data,
    isLoading,
    refetch: userRefetch,
  } = useGetUserChatQuery(email, { skip: email ? false : true });

  const {
    data: getConnectionData,
    isLoading: isGetConnectionLoading,
    refetch,
  } = useGetConnectionQuery({ email }, { skip: isSkip });
  console.log(getConnectionData, isGetConnectionLoading, "all connection");
  console.log(data, isLoading);

  const [
    createConnection,
    {
      data: connectionData,
      isSuccess: isConnectSuccess,
      isError: isConnectError,
    },
  ] = useCreateConnectionMutation();
  console.log(isConnectError, isConnectSuccess, connectionData, "request");
  const [ConnectionStatus, { data: statusData, isSuccess, isError }] =
    useUpdateConnectionStatusMutation();

  useEffect(() => {
    if (statusData) {
      socket.emit("refetchPendingFromCient", statusData.requestedBy);
    }
    if (connectionData) {
      socket.emit("refetchAllConnectionFromCient", "refetch");
    }
    if (email) {
      setIsSkip(false);
    }
  }, [email, connectionData, statusData]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedIndex_1, setSelectedIndex_1] = useState(0);

  const [connectionID, setConnectionId] = useState("");
  const [receverPerson, setReceverPerson] = useState<{
    email: string;
    name: string;
  }>({ email: "", name: "" });

  console.log(statusData, isSuccess, isError, "status");
  const changeConnectionStatus = (id: string) => {
    ConnectionStatus({ id: id });
  };
  const showMsg = ({
    id,
    index,
    singleConnection,
  }: {
    id: string;
    index: number;
    singleConnection: [{ email: string; name: string }];
  }) => {
    socket.emit("join", id);
    setSelectedIndex(index + 1);
    setConnectionId(id);
    const person = singleConnection?.filter((p) => p.email !== email)[0];
    console.log(person, "person");
    setReceverPerson(person);
  };

  const openSlider = (number: number) => {
    if (number == 1) {
      const slider1 = document.getElementById("slide1") as HTMLElement;
      // console.log('hit',slider1)
      slider1.classList.toggle("active1");
    }
    if (number == 2) {
      const slider2 = document.getElementById("slide2") as HTMLElement;
      slider2.classList.toggle("active2");
    }
  };
  const [onlineUsers, setOnlineUsers] = useState<[string]>([""]);
  //console.log(onlineUsers,'online user')

  useEffect(() => {
    const useremail = email;
    socket.emit("login", useremail);

    // Listen for online user updates
    socket.on("updateOnlineUsers", (updatedOnlineUsers) => {
      setOnlineUsers(updatedOnlineUsers);
    });

    socket.on("refetchAllConnectionFromServer", (data: string) => {
      console.log(data, "dddddddddddddddataaaaaaaaaaaaaaaaa");

      if (data) {
        refetch();
      }
    });

    socket.on("pendigStatus", (soket_Email: string) => {
      /////////////////////////////////////////
      console.log(soket_Email, "soket emailll");
      if (soket_Email == email) {
        userRefetch();
        refetch();
      }
    });
  }, [email, socket]);

  return (
    <div className="chat-container">
      <div id="slide1" className="chat-box cbox-1 ">
        <div onClick={() => openSlider(1)} className="slide2 active">
          <RiMenuUnfoldFill />
        </div>
        <div>
          <div className="chat-title">
            <h3 style={{ textAlign: "center" }}>Pending Connection</h3>
          </div>
          <div className="pending-connection">
            {getConnectionData?.getAllConnection?.allPendingConnection.length ==
              0 && <p style={{ textAlign: "center" }}>No Pending Request</p>}
            {getConnectionData?.getAllConnection?.allPendingConnection?.map(
              (singleConnection, index) => {
                return (
                  <div
                    onClick={() => setSelectedIndex_1(index + 1)}
                    style={
                      index + 1 == selectedIndex_1
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
                        .map((p) => (
                          <>{p.name}</>
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
          <div className="chat-title">
            <h3 style={{ textAlign: "center" }}>Your Connections</h3>
          </div>
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
                          <p className="online-notification" key={index}>
                            <div>{p.name} </div>
                            <div className="notify">
                              {onlineUsers.includes(p.email) && (
                                <FaRegDotCircle />
                              )}
                            </div>{" "}
                          </p>
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
          receverPerson={receverPerson}
          email={email}
          connectionID={connectionID}
        ></MessageBox>
      </div>

      <div id="slide2" className="chat-box cbox-3 ">
        <div onClick={() => openSlider(2)} className="slide1">
          <RiMenuFoldFill />
        </div>

        <div className="chat-title">
          <h3>All Users</h3>
        </div>
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
