# AppWorks-Habit-Diary-Project-Backend

Install node modules: `npm init`.

Download npm packages as needed: `npm install <package name>`.

Use `npm run start:dev` to run the server.

APIS:

// 測試API  
GET user/test  
request: {}  
response: {}

//post diary

<br>
<br>

## POST /sessions


request:
{
"user":"",
"content":""
}


response:
{
    "Diaryid": "",
    "user": "",
    "AIresponse": "",
    "content": [
        ""
    ],
    "createdAt": "2023-10-17T11:03:09.631Z"
}


//get diary

<br>
<br>

## GET /sessions/:sessionId


request:
{}


response:
{
      Diaryid: ,
      user: ,
      AIresponse: ,
      content: ,
      createdAt: ,
}

<br>
<br>

## POST /sessions/:sessionId/content

request:
{
  "user": "",
  "content": ""
}

response:
{
  "AIresponse": ""
}
