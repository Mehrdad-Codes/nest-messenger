import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import SendMessageDto from 'src/interfaces/sendMessage.dto';
import { MessagesService } from './messages.service';
import GetMessagesDto from 'src/interfaces/getMessages.dto';
@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @UseGuards(AuthGuard)
  @Post('send')
  sendMessage(@Body() sendMessageDto: SendMessageDto) {
    return this.messagesService.sendMessage(sendMessageDto);
  }

  @UseGuards(AuthGuard)
  @Get('messages')
  getMessage(@Query() getMessagesDto: GetMessagesDto) {
    return this.messagesService.aquireMessages(getMessagesDto.pagination);
  }
}
