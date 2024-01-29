import { BiSend } from "react-icons/bi";
import {
  useGetMessageByIdQuery,
  usePostMessageMutation,
} from "../../Redux/feature/api/baseApi";
import { useEffect, useRef, useState } from "react";

import { FaUsers } from "react-icons/fa6";
import { TbUserHexagon } from "react-icons/tb";
import { socket } from "../../socketio/socketio";

interface Props {
  email: string;
  connectionID: string;
  receverPerson: { email: string; name: string };
  openSlider: (number: number) => void;
  receverSocketID:{email:string,socketID:string};
  senderSocketID:{email:string,socketID:string};

}
function MessageBox({ email, connectionID, receverPerson, openSlider,receverSocketID,senderSocketID }: Props) {

  const msgRef = useRef<any>();

  const [msg, setMessage] = useState("");


  const {data,isLoading} = useGetMessageByIdQuery(
    { cId: connectionID },
    { skip: !connectionID, refetchOnMountOrArgChange: true }
  );

  const [allMessage,setAllMessage]=useState( [{_id:'',connect_Id:'',msgData:{email:'',message:''}}])

  const [sendMsg] = usePostMessageMutation();

  useEffect(()=>{
  if(!isLoading ){
if(data){
  setAllMessage(data?.allMessage)
}
  }
  },[isLoading])

  useEffect(() => {
    msgRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessage?.length]);

  useEffect(()=>{
    socket.on('reciver',(data:{connectionID:string,msgData:{email:string,message:string}})=>{
     // console.log(data,'server')
if(data){
  setAllMessage((p)=>[...p,{_id:'',connect_Id:data.connectionID,msgData:{email:data.msgData.email,message:data.msgData.message}}])
}
    })
  },[socket])

  const sendMessage = (): void => {
    if (msg !== "") {
      sendMsg({
        connect_Id: connectionID,
        msgData: { email: email, message: msg },
      });
    }
    socket.emit('msgFromSender',{msgData: { email: email, message: msg },connectionID:connectionID,receverSocketID,senderSocketID})
    setMessage("",);
  };

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
            {allMessage?.length == 1 && allMessage[0]?._id == "" ? (
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
