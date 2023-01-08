import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
	return currentUser ? (
		<h1>You are signed in</h1>
	) : (
		<h1>You are not signed in</h1>
	);
};
//http://ingress-nginx-controller.ingress-nginx.svc.cluster.local
LandingPage.getInitialProps = async (context) => {
	// console.log(context);
	const response = await buildClient(context).get("/api/users/currentuser");
	return response.data;
};

export default LandingPage;
