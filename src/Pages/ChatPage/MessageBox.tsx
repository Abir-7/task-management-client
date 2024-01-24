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
  } = useGetMessageByIdQuery({ cId: connectionID }, { skip: !connectionID });


  const [data, setData] = useState<getMessageResponse>();
  console.log(data1);
  useEffect(() => {
    if (socket) {
      socket.on("message", (message: [singleMsg]) => {
        console.log(message, "121212121");
        //setData(message)
        if (message) {
          setData({ allMessage: message });
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

  //console.log(postError, postSuccess, postMsgData, "ssssssssssssss");
  //console.log( isLoading, isError, error, connectionID);
  useEffect(() => {
    if (connectionID || data1?.allMessage) {
      refetch();
      setData(data1);
    }
    if (postMsgData?.postMessage) {
      socket.emit("message", connectionID, postMsgData?.allMessage);
    }
  }, [data1?.allMessage, connectionID]);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const msg = (e.target as HTMLFormElement).msginput.value;
    // console.log(msg);
    sendMsg({
      connect_Id: connectionID,
      msgData: { email: email, message: msg },
    });
    e.currentTarget.reset()
  };

  return (
    <>
      {connectionID ? (
        <>
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
          <form onSubmit={sendMessage}>
            <div className="sendInput">
              <input name="msginput" type="text" />
              <div className="sendButton">
                <button type="submit">
                  <BiSend />
                </button>
              </div>
            </div>
          </form>
        </>
      ) : (
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <h3>Please select a user</h3>
        </div>
      )}
    </>
  );
}

export default MessageBox;
