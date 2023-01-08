import axios from "axios";

const LandingPage = ({ currentUser }) => {
	console.log(currentUser);
	console.log("hello");
};
//http://ingress-nginx-controller.ingress-nginx.svc.cluster.local
LandingPage.getInitialProps = async ({ req }) => {
	// console.log(req.headers)

	if (typeof window === "undefined") {
		//we are on server so make req to ingress service   //http://SERVICE-NAME.NAMESPACE.svc.cluster.local
		const response = await axios.get(
			"http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
			{
				headers: req.headers,
			}
		);

		return response.data;
	} else {
		//we are on browser
		const response = await axios.get("/api/users/currentuser");
		return response.data;
	}
	return {};
};

export default LandingPage;
