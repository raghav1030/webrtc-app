import React, {  createContext, useMemo }  from 'react'


export const PeerContext = createContext(null);

const PeerProvider = (props) => {

    const peer = useMemo(()=> new RTCPeerConnection({
        iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            {
                urls: 'turn:turn.bistri.com:80',
                credential: 'homeo',
                username: 'homeo'
            }
        ]
        

    }) , []);

    const createOffer = async()=>{
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        return offer;
    }

    const createAnswer = async(offer)=>{
        await peer.setRemoteDescription(offer);
        const answer = peer.createAnswer();
        return answer;
    }

    const setRemoteDescriptionAnswer = async(answer)=>{
        await peer.setRemoteDescription(answer);
    }

    const sendStream = async(stream) => {
        const tracks = stream.getTracks();
        tracks.forEach(track => {
            peer.addTrack(track, stream);
        });
    }

  return (
    <PeerContext.Provider value={{peer , createOffer , createAnswer, setRemoteDescriptionAnswer , sendStream}}  >
        {props.children}
    </PeerContext.Provider>
    )
}

export default PeerProvider