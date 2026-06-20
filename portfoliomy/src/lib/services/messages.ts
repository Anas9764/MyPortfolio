import { connectDB } from "@/lib/db/connect";
import { Message } from "@/lib/models";
import { sendNotificationEmail, sendReplyEmail } from "@/lib/services/email";

export async function createMessage(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  await connectDB();
  const newMessage = new Message(data);
  await newMessage.save();
  await sendNotificationEmail(data);
  return newMessage;
}

export async function listMessages() {
  await connectDB();
  return Message.find().sort({ createdAt: -1 });
}

export async function deleteMessage(id: string) {
  await connectDB();
  await Message.findByIdAndDelete(id);
  return { message: "Message deleted" };
}

export async function replyToMessage(data: {
  to: string;
  subject: string;
  body: string;
  replyTo?: string;
}) {
  await sendReplyEmail(data);
  return { message: "Reply sent successfully" };
}
