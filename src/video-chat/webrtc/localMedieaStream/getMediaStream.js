let mediaStream =null;

export default async  function getMediaStream (mediaConstraints,cb){

	try {
       
		mediaStream =await  navigator.mediaDevices.getUserMedia({video:true,audio:false});
		cb(null,mediaStream);
	}
	catch (error) {
  
		cb(error,null);
	}


}