
## What is webRTC

WebRTC stands for web real-time communications. It is a very exciting, powerful, and highly disruptive cutting-edge technology and standard. 


### WebRTC APIs
The WebRTC standard covers, on a high level, two different technologies: media capture devices and peer-to-peer connectivity.

Media capture devices includes video cameras and microphones, but also screen capturing "devices". For cameras and microphones, we use navigator.mediaDevices.getUserMedia() to capture MediaStreams. For screen recording, we use navigator.mediaDevices.getDisplayMedia() instead.

The peer-to-peer connectivity is handled by the RTCPeerConnection interface. This is the central point for establishing and controlling the connection between two peers in WebRTC.

### Peer-To-Peer Communication

WebRTC can be used for multiple tasks, but real-time peer-to-peer audio and video (i.e., multimedia) communications is the primary benefit. In order to communicate with another person (i.e., peer) via a web browser, each person’s web browser must agree to begin communication, know how to locate one another, bypass security and firewall protections, and transmit all multimedia communications in real-time.

One of the biggest challenges associated with browser-based peer-to-peer communications is knowing how to locate and establish a network socket connection with another computer’s web browser in order to bidirectionally transmit multimedia data. The difficulties associated with this may not seem obvious at first, but let me explain further.

When you visit a web site, you typically enter a web address or click a link to view the page. A request is made to a server that responds by providing the web page (HTML, CSS, and JavaScript). The key here is that you make an HTTP request to a known and easily locatable (via DNS) server and get back a response (i.e., the web page).

Now let’s say I wanted to have a video chat with my dear ol’ mom. My mom’s computer is not a web server. Therefore, the problem is how do I make the request and actually receive her audio and video data directly, while also sending my audio and video data directly to her, but without going through an external server? Enter WebRTC!