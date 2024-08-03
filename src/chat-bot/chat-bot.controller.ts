import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpStatus } from '@nestjs/common';
import { ChatBotService } from './chat-bot.service';
import { CreateChatBotDto } from './dto/create-chat-bot.dto';
import { UpdateChatBotDto } from './dto/update-chat-bot.dto';
import { Response, Request } from "express";
import axios from 'axios';

@Controller('chat-bot')
export class ChatBotController {
  constructor(private readonly chatBotService: ChatBotService,
    
  ) {}

  @Get("getChatData")
  async findAll(
    @Req() req: Request,
    @Res() res: Response
  ) {
    try {
      let getSalesData = await this.chatBotService.getAllChatData();
      res.status(HttpStatus.OK).json({
        data: getSalesData,
        success: true,
        message: "Getting successfully",
      });
    } catch (error) {
      console.log("error", error);
      res.status(HttpStatus.OK).json({
        success: false,
        message: "Getting error",
      })
    }
  }

  @Get("getPieData")
  async getPieData(
    @Req() req: Request,
    @Res() res: Response
  ) {
    try {
      let pieData = await this.chatBotService.getPieData();
      res.status(HttpStatus.OK).json({
        data: pieData,
        success: true,
        message: "Getting successfully",
      });
    } catch (error) {
      console.log("error", error);
      res.status(HttpStatus.OK).json({
        success: false,
        message: "Getting error",
      })
    }
  }
  @Get("getTableOuter")
  async getTableOuter(
    @Req() req: Request,
    @Res() res: Response
  ) {
    try {
      let pieData = await this.chatBotService.getTableOuter();
      res.status(HttpStatus.OK).json({
        data: pieData,
        success: true,
        message: "Getting successfully",
      });
    } catch (error) {
      console.log("error", error);
      res.status(HttpStatus.OK).json({
        success: false,
        message: "Getting error",
      })
    }
  }
  @Get("getTableInner")
  async getTableInner(
    @Req() req: Request,
    @Res() res: Response
  ) {
    try {
      let pieData = await this.chatBotService.getTableInner();
      res.status(HttpStatus.OK).json({
        data: pieData,
        success: true,
        message: "Getting successfully",
      });
    } catch (error) {
      console.log("error", error);
      res.status(HttpStatus.OK).json({
        success: false,
        message: "Getting error",
      })
    }
  }
  // @Post("/insertChatBot")
  // async createChatData(req: Request, res: Response, @Body() data: any){
  //   try {
  //     console.log('dddddddddddddddddddddddd',data);
      
  //     const { name, categoryId, createdBy } = data;
  //     const chatData = await this.chatBotService.createChatData(name, categoryId, createdBy);
  //     res.status(HttpStatus.OK).json({
  //       message: 'success',
  //       data: chatData
  //     });
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // }

  @Post("generateData")
  async generate(
    @Req() req: Request,
    @Res() res: Response,
    @Body() data: any
  ) {
    const { prompt } = data;
    try {
      // let getSalesData = await this.chatBotService.getAllChatData();
      var response = await axios.post('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
              contents: [
                {
                  role: 'user',
                  parts: [{ text: prompt }]
                }
              ]
            }, {
              headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': "AIzaSyC0029wEeoLAtsZuTUFk4Z0vM2loafLwF0"
              }
            });
        let databasePromt = `${prompt} give me JSON format and category only in the following topics: [Science, General Knowledge, Art, History, Literature]. Do not give an array for 'related_topics', provide only string or number. Each result should have the following fields: question_simplified, answer_simplified, question_category, question_language, related_topics, difficulty_level, danger_level. Each JSON object should represent one question-answer pair with non-empty values. The structure of each JSON object should be as follows:

        {
          "question_simplified": "your question here",
          "answer_simplified": "your answer here",
          "question_category": "Science/General Knowledge/Art/History/Literature",
          "question_language": "your language here",
          "related_topics": "your related topic here",
          "difficulty_level": "your difficulty level here",
          "danger_level": "your danger level here"
        }
        
        Example of how this data will be used in a MySQL query:
        
        INSERT INTO questions (
          question_text,
          answer_text,
          question_category,
          question_language,
          related_topics,
          difficulty_level,
          danger_level
        ) VALUES (
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?
        );
        
        Provide the result in JSON format only.
        `
            console.log('rrrrrrrrrrrrrrrrrrrrrrrrrrrrr',response);
          var databaseRes =  await axios.post('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
              contents: [
                {
                  role: 'user',
                  parts: [{ text: databasePromt }]
                }
              ]
            }, {
              headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': "AIzaSyC0029wEeoLAtsZuTUFk4Z0vM2loafLwF0"
              }
            });
            console.log('llllllllllllllllllllll',databaseRes);
      this.chatBotService.createChatData(databaseRes.data.candidates[0].content.parts[0].text);
            
      res.status(HttpStatus.OK).json({
        data: response.data.candidates[0].content.parts[0].text,
        success: true,
        message: "Getting successfully",
      });

    } catch (error) {
      console.log("error", error);
      res.status(HttpStatus.OK).json({
        success: false,
        message: "Getting error",
      })
    }
  }


  // @Post("/generateData")
  // async generateData(req: Request, res: Response, @Body() data: any){
  //   const { prompt } = data;
  // console.log('pppppppppppppppppppppppp', prompt);
  // let getSalesData = await this.chatBotService.getAllChatData();
  // res.status(200).json({
  //   data: getSalesData,
  //   success: true,
  //   message: "Getting successfully",
  // });
  //   // try {
  //   //   const response = await axios.post('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
  //   //     contents: [
  //   //       {
  //   //         role: 'user',
  //   //         parts: [{ text: prompt }]
  //   //       }
  //   //     ]
  //   //   }, {
  //   //     headers: {
  //   //       'Content-Type': 'application/json',
  //   //       'x-goog-api-key': "AIzaSyC0029wEeoLAtsZuTUFk4Z0vM2loafLwF0"
  //   //     }
  //   //   });
  //   //   console.log('rrrrrrrrrrrrrrrrrrrr',response);
      
  //   //   res.status(HttpStatus.OK).json({
  //   //     message: 'success',
  //   //   });
  //   // } catch (error) {
  //   //   console.error(error);
  //   //   res.status(500).json({ error: 'Something went wrong' });
  //   // }
  // }
  // @Post('/getMonthlyData')
  // async getMonthlyData(@Body() data: JSON, @Req() req: Request, @Res() res: Response,) {
  //   console.log("data from front end===>", data)
  //   try {
  //     let MonthlyData = await this.salesService.getMonthlyData(req, data)
  //     res.status(HttpStatus.OK).json({
  //       data: MonthlyData,
  //       success: true,
  //       message: 'Monthly wise filtered data get successfully.'
  //     })
  //   }
  //   catch (error) {
  //     console.log("error", error)
  //     res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
  //       success: false,
  //       message: 'Error in get Monthly wise filtered!'
  //     })
  //   }
  // }
}
