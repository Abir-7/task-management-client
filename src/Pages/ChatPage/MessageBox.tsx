import { BiSend } from "react-icons/bi";
import {
  useGetMessageByIdQuery,
  usePostMessageMutation,
} from "../../Redux/feature/api/baseApi";
import { useEffect, useRef, useState } from "react";
import { socket } from "../../socketio/socketio";
import { singleMsg } from "../../Redux/feature/api/interface";

import { FaUsers } from "react-icons/fa6";
import { TbUserHexagon } from "react-icons/tb";
interface Props {
  email: string;
  connectionID: string;
  receverPerson: { email: string; name: string };
  openSlider: (number: number) => void;
}
function MessageBox({ email, connectionID, receverPerson, openSlider }: Props) {
  const { data, isLoading, 
    //isFetching, refetch 
  } = useGetMessageByIdQuery(
    { cId: connectionID },
    { skip: !connectionID, refetchOnMountOrArgChange: true }
  );
    console.log(connectionID)
  const [allMessage, setAllMessage] = useState<singleMsg[]>([
    { _id: "", connect_Id: "", msgData: { email: "", message: "" } },
  ]);

  const [ 
    sendMsg,
    { data: postMsgData },
  ] = usePostMessageMutation();

  useEffect(() => {
    if (!isLoading) {
      if (data) {
        setAllMessage(data?.allMessage);
      }
    }
  }, [isLoading,connectionID]);

  useEffect(()=>{
    if (postMsgData) {
      console.log('hit',postMsgData.postMessage)
      socket.emit("message", postMsgData.postMessage);
    }
  },[postMsgData])

  useEffect(() => {
    if (socket) {
      socket.on("message2", (message: { connect_Id: string; msgData:{email:string,message:string},_id:string,__v:number }) => {
        console.log(message.connect_Id,'m from server',connectionID,'gg')
        if (message.connect_Id == connectionID) {
          if (message.msgData) {
            console.log(message,'message from server')
            setAllMessage((p: any) => [...p, message]);
          }
     
        }
      });
    }
  }, [socket,connectionID]);

  //console.log(allMessage?.length);

  const [msg, setMessage] = useState("");
  const sendMessage = (): void => {
    if (msg !== "") {
      sendMsg({
        connect_Id: connectionID,
        msgData: { email: email, message: msg },
      });
    }
    setMessage("");
  };

  const msgRef = useRef<any>();

  useEffect(() => {
    msgRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessage?.length]);

  return (
    <>
      {connectionID ? (
        <div className="msg-container">
          <div className="chat-head">
            {" "}
            <div onClick={() => openSlider(1)} className="cross2">
              <TbUserHexagon />
            </div>
            <div> {receverPerson?.name}</div>{" "}
            <div onClick={() => openSlider(2)} className="cross">
              <FaUsers />
            </div>{" "}
          </div>{" "}
          <div className="messagebox">
            {allMessage.length == 1 && allMessage[0]._id == "" ? (
              <h2>Start Message with {receverPerson?.name}</h2>
            ) : (
              <div>
                {allMessage?.map((msg, index) => (
                  <div
                    ref={msgRef}
                    style={
                      msg?.msgData?.email == email
                        ? { justifyContent: "right" }
                        : {}
                    }
                    className="text-msg-box"
                    key={index}
                  >
                    <p
                      className="text-msg"
                      style={
                        msg?.msgData?.email == email
                          ? {
                              textAlign: "right",
                              backgroundColor: "#9f65fc",
                              color: "#ffffff",
                            }
                          : {}
                      }
                    >
                      {msg?.msgData?.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="send-box">
            <div className="sendInput">
              <input
                value={msg}
                onChange={(e) => setMessage(e.target.value)}
                name="msginput"
                type="text"
              />
              <div className="sendButton">
                <button onClick={() => sendMessage()} type="submit">
                  <BiSend />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            marginTop: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
          }}
        >
          <div>
            {" "}
            <div onClick={() => openSlider(1)} className=" cross2">
              <TbUserHexagon />
            </div>{" "}
          </div>{" "}
          <div>
            <h3 style={{ margin: "0 5px" }}>Please select a user</h3>
          </div>
          <div onClick={() => openSlider(2)} className="cross ">
            <FaUsers />
          </div>
        </div>
      )}
    </>
  );
}

export default MessageBox;
