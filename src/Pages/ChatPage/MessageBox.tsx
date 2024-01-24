import { BiSend } from "react-icons/bi";
import {
  useGetMessageByIdQuery,
  usePostMessageMutation,
} from "../../Redux/feature/api/baseApi";
import { useEffect, useState } from "react";
import { socket } from "../../socketio/socketio";
import {
  getMessageResponse,
  singleMsg,
} from "../../Redux/feature/api/interface";
interface Props {
  email: string;
  connectionID: string;
  receverPerson: { email: string; name: string };
}
function MessageBox({ email, connectionID, receverPerson }: Props) {

  const {
    data: data1,
    refetch,
    isLoading,
  } = useGetMessageByIdQuery({ cId: connectionID }, { skip:!receverPerson });


  useEffect(() => {
    if (connectionID ||receverPerson.email) {
      refetch();
      
    }
    setData(data1)
    // if (postMsgData?.postMessage) {
    //   socket.emit("message", connectionID, postMsgData?.allMessage);
    // }
  }, [connectionID,receverPerson.email]);




  const [data, setData] = useState<getMessageResponse>();
  console.log(data1);
  useEffect(() => {
    if (socket) {
      socket.on("message", (message: {id:string,getMessage:[singleMsg]}) => {
        console.log(message, "121212121");
        //setData(message)
        if (message) {
         if(message.id==connectionID){
          setData({ allMessage: message.getMessage });
         }
        }
      });
    }
    if (!isLoading) {
      setData(data1);
    }
  }, [socket, isLoading]);

  const [
    sendMsg,
    { data: postMsgData, isError: postError, isSuccess: postSuccess },
  ] = usePostMessageMutation();

  console.log(postError, postSuccess, postMsgData, "ssssssssssssss");
  //console.log( isLoading, isError, error, connectionID);




const [msg,setMessage]=useState('')
  const sendMessage = ():void => {
    // console.log(msg);
   if(msg!==''){
    sendMsg({
      connect_Id: connectionID,
      msgData: { email: email, message: msg },
    });
   }
   setMessage('')
  };

  return (
    <>
      {connectionID ? (
        <div className="msg-container">
          <div className="chat-head"> {receverPerson?.name}</div>{" "}
          <div className="messagebox">
            {data?.allMessage?.map((msg, index) => (
              <div
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
          <div className="send-box">
            <div className="sendInput">
              <input value={msg} onChange={(e)=>setMessage(e.target.value)} name="msginput" type="text" />
              <div className="sendButton">
                <button   onClick={()=>sendMessage()} type="submit">
                <BiSend />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center", marginTop: "10px",display:'flex',justifyContent:'center',alignItems:'center' ,height:'60vh' }}>
          <h3>Please select a user</h3>
        </div>
      )}
    </>
  );
}

export default MessageBox;
