import express from "express";
const router = express.Router();

router.post("/api/users/signout", (req, res) => {
	res.send("hellu lolu");
});

export { router as signoutRouter };
