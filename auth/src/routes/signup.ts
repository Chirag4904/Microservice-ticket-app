import express from "express";
const router = express.Router();

router.post("/api/users/signup", (req, res) => {
	res.send("hellu lolu");
});

export { router as signupRouter };
