const express = require("express");
const { userAuth } = require("../middlewares/auth");
const Chat = require("../models/chat");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;

  const loggedInUser = req.user;

  let chat = await Chat.findOne({
    participants: { $all: [loggedInUser, targetUserId] },
  }).populate({
    path: "messages.senderId",
    select:"firstName lastName"
  });

  if (!chat) {
    chat = new Chat({
      participants: [loggedInUser, targetUserId],
      messages: [],
    });
  }

  res.send(chat);
});

module.exports = chatRouter;
