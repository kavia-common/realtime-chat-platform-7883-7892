#!/bin/bash
cd /home/kavia/workspace/code-generation/realtime-chat-platform-7883-7892/chat_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

