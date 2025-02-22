import React from "react";
import { useSelector } from "react-redux";
function ChannelList() {
  const { channels } = useSelector((store) => store.channel);
  console.log(channels);
  return <div>channels</div>;
}

export default ChannelList;
