import express from "express";
const router = express.Router();

router.get("/api/users/currentuser", (req, res) => {
	res.send("hellu lolu");
});

export { router as currentUserRouter };
