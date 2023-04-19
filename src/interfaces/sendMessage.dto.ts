export default interface SendMessageDto {
  userId: string;
  body: string;
  repliedTo?: string; // Replied Message Id
}
