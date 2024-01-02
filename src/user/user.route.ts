import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Birds home pagesm344");
});

export default router;
